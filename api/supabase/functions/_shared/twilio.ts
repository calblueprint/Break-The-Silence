// Reusable Twilio SMS helper. Credentials are read from Edge Function secrets
// and never leave the backend.
//
// Safety: mock mode is the DEFAULT. Real SMS is only sent when
// TWILIO_MOCK is explicitly set to "false" AND all credentials are present.

export interface SendSmsParams {
  from: string; // relay number (E.164)
  to: string; // recipient (E.164)
  body: string;
}

export interface SendSmsResult {
  sid: string;
  status: string;
  mocked: boolean;
}

export class TwilioError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'TwilioError';
  }
}

export function isMockMode(env: {
  get(k: string): string | undefined;
}): boolean {
  return env.get('TWILIO_MOCK') !== 'false';
}

export async function sendSms(
  params: SendSmsParams,
  env: { get(k: string): string | undefined } = Deno.env,
  fetchImpl: typeof fetch = fetch,
): Promise<SendSmsResult> {
  if (isMockMode(env)) {
    console.log(
      `[twilio:mock] ${params.from} -> ${params.to} (${params.body.length} chars)`,
    );
    return {
      sid: `SMmock${crypto.randomUUID().replaceAll('-', '')}`,
      status: 'queued',
      mocked: true,
    };
  }

  const accountSid = env.get('TWILIO_ACCOUNT_SID');
  const authToken = env.get('TWILIO_AUTH_TOKEN');
  if (!accountSid || !authToken) {
    throw new TwilioError('Twilio credentials are not configured');
  }

  const res = await fetchImpl(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: params.from,
        To: params.to,
        Body: params.body,
      }),
    },
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new TwilioError(data?.message ?? 'Twilio request failed', res.status);
  }
  return { sid: data.sid, status: data.status, mocked: false };
}
