import type { RelayMap } from '../_shared/relay-map.ts';
import type { SendSmsParams, SendSmsResult } from '../_shared/twilio.ts';
import { getRelayNumberForUser, isValidE164 } from '../_shared/relay-map.ts';
import { TwilioError } from '../_shared/twilio.ts';

// Request handler for support-relay-send, with dependencies injected so it can
// be tested without Supabase or Twilio.
//
// Flow: Test User -> (JWT) -> this handler -> assigned relay number -> Twilio (mock by default)

export interface Deps {
  /** Verifies the bearer token and returns the user id, or null if invalid. */
  authenticate: (token: string) => Promise<{ id: string } | null>;
  relayMap: RelayMap;
  send: (params: SendSmsParams) => Promise<SendSmsResult>;
}

const MAX_BODY_LENGTH = 1600; // Twilio's max for a single API message

function json(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleRequest(
  req: Request,
  deps: Deps,
): Promise<Response> {
  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  // 1. Authenticate. The user identity comes ONLY from the verified token.
  const header = req.headers.get('Authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return json(401, { error: 'Missing bearer token' });

  const user = await deps.authenticate(match[1]).catch(() => null);
  if (!user) return json(401, { error: 'Invalid or expired token' });

  // 2. Parse + validate input.
  let payload: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))
      throw new Error();
    payload = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: 'Request body must be a JSON object' });
  }

  // Callers must never choose the sender number. Reject rather than silently
  // ignore so a misbehaving client is noticed.
  if ('from' in payload || 'relayNumber' in payload) {
    return json(403, {
      error: 'Sender number cannot be specified by the client',
    });
  }

  const { to, body } = payload;
  if (!isValidE164(to)) {
    return json(400, {
      error: "'to' must be an E.164 phone number, e.g. +15555550123",
    });
  }
  if (typeof body !== 'string' || body.trim().length === 0) {
    return json(400, { error: "'body' must be a non-empty string" });
  }
  if (body.length > MAX_BODY_LENGTH) {
    return json(400, {
      error: `'body' must be at most ${MAX_BODY_LENGTH} characters`,
    });
  }

  // 3. Select the relay number from the authenticated user's id.
  const from = getRelayNumberForUser(deps.relayMap, user.id);
  if (!from) {
    return json(403, { error: 'No relay number assigned to this user' });
  }

  // 4. Send.
  try {
    const result = await deps.send({ from, to, body });
    return json(200, {
      ok: true,
      sid: result.sid,
      status: result.status,
      mocked: result.mocked,
      from, // the relay number used; handy for verifying mapping in the POC
    });
  } catch (err) {
    if (err instanceof TwilioError) {
      console.error(
        '[support-relay-send] twilio error',
        err.status,
        err.message,
      );
      return json(502, { error: 'Upstream messaging provider error' });
    }
    console.error('[support-relay-send] unexpected error', err);
    return json(500, { error: 'Internal error' });
  }
}
