// Request handler for support-relay-receive (inbound replies), with dependencies
// injected so it can be tested without Supabase or Twilio.
//
// Flow: volunteer reply (Talkroute) -> SMS to relay number -> Twilio -> this webhook
//       -> verify signature -> find the user who owns the relay number -> store -> notify (mock)
//
// Privacy: this is a survivor support line. Never log message bodies or phone
// numbers. Log only short reason codes and message/user ids.

import type { InboundMessage, MessageStore } from '../_shared/inbound-store.ts';
import type { RelayMap } from '../_shared/relay-map.ts';
import { getUserForRelayNumber } from '../_shared/relay-lookup.ts';
import { isValidE164 } from '../_shared/relay-map.ts';
import { isValidTwilioSignature } from '../_shared/twilio-signature.ts';

export interface InboundDeps {
  /** Twilio auth token, used to verify webhook signatures. */
  authToken: string | undefined;
  /** The exact public URL configured in Twilio for this webhook (it is part of the signature). */
  webhookUrl: string | undefined;
  relayMap: RelayMap;
  /**
   * Numbers allowed to reach survivors through a relay number (BTSADV's Talkroute
   * number). A relay number is a normal phone number, so without this anyone who
   * texted it would land in a survivor's inbox. Empty list = drop everything.
   */
  allowedSenders: string[];
  store: MessageStore;
  /** Best-effort nudge to the app (push, realtime). The store is the source of truth. */
  notify: (message: InboundMessage) => Promise<void>;
}

const MAX_SID_LENGTH = 64;
const EMPTY_TWIML =
  '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

/** Empty TwiML: tells Twilio "received, send no automatic reply". */
function twiml(): Response {
  return new Response(EMPTY_TWIML, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

function text(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain' },
  });
}

function log(reason: string) {
  console.log(`[support-relay-receive] ${reason}`);
}

/** Parses INBOUND_ALLOWED_SENDERS: comma-separated E.164 numbers. Throws on a bad entry. */
export function parseAllowedSenders(raw: string | undefined): string[] {
  const numbers = (raw ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  for (const number of numbers) {
    if (!isValidE164(number)) {
      throw new Error(
        'INBOUND_ALLOWED_SENDERS must be comma-separated E.164 numbers',
      );
    }
  }
  return numbers;
}

export async function handleInbound(
  req: Request,
  deps: InboundDeps,
): Promise<Response> {
  if (req.method !== 'POST') return text(405, 'Method not allowed');

  // Fail closed: without these we cannot verify the sender, so accept nothing.
  if (!deps.authToken || !deps.webhookUrl) {
    console.error(
      '[support-relay-receive] TWILIO_AUTH_TOKEN / TWILIO_WEBHOOK_URL not configured',
    );
    return text(500, 'Webhook not configured');
  }

  // 1. Verify the request really came from Twilio, before trusting anything in it.
  const params = new URLSearchParams(await req.text());
  const signature = req.headers.get('X-Twilio-Signature');
  if (
    !(await isValidTwilioSignature(
      deps.authToken,
      deps.webhookUrl,
      params,
      signature,
    ))
  ) {
    log('rejected: invalid signature');
    return text(403, 'Invalid signature');
  }

  // 2. Validate fields.
  const messageSid = params.get('MessageSid');
  const from = params.get('From');
  const to = params.get('To');
  const body = params.get('Body') ?? '';
  if (
    !messageSid ||
    messageSid.length > MAX_SID_LENGTH ||
    !isValidE164(from) ||
    !isValidE164(to)
  ) {
    log('rejected: malformed request');
    return text(400, 'Malformed request');
  }

  // From here on the request is genuine Twilio traffic. Anything we don't want to
  // deliver gets an empty 200 (not an error) so Twilio doesn't flag or retry it.

  // 3. Only BTSADV's own number may reach a survivor.
  if (!deps.allowedSenders.includes(from)) {
    log('dropped: sender not allowed');
    return twiml();
  }

  // 4. Which user owns this relay number? Must be exactly one.
  const userId = getUserForRelayNumber(deps.relayMap, to);
  if (!userId) {
    log('dropped: no unique user for relay number');
    return twiml();
  }

  if (body.trim().length === 0) {
    log('dropped: empty body');
    return twiml();
  }

  // 5. Store. Twilio can deliver the same message more than once, so dedupe on MessageSid.
  const message: InboundMessage = {
    messageSid,
    userId,
    from,
    to,
    body,
    receivedAt: new Date().toISOString(),
  };

  let isNew: boolean;
  try {
    isNew = await deps.store.saveIfNew(message);
  } catch (err) {
    console.error('[support-relay-receive] store error', err);
    return text(500, 'Internal error');
  }
  if (!isNew) {
    log(`ignored: duplicate ${messageSid}`);
    return twiml();
  }

  // 6. Notify the app. Best-effort: the message is already stored, so a failed
  // nudge must not turn into an error response.
  try {
    await deps.notify(message);
  } catch (err) {
    console.error(
      `[support-relay-receive] notify failed for ${messageSid}`,
      err,
    );
  }

  return twiml();
}
