// Supabase Edge Function: support-relay-receive
// Twilio webhook for inbound replies to a user's relay number (POC).
//
// Twilio cannot send a Supabase login token, so this function must be deployed
// with JWT verification OFF (see README). Security comes from the Twilio
// signature check in handler.ts instead.

import { InMemoryMessageStore } from '../_shared/inbound-store.ts';
import { loadRelayMap } from '../_shared/relay-map.ts';
import { handleInbound, parseAllowedSenders } from './handler.ts';

// Loaded once at startup, so bad configuration fails the function immediately.
const relayMap = loadRelayMap(Deno.env);
const allowedSenders = parseAllowedSenders(
  Deno.env.get('INBOUND_ALLOWED_SENDERS'),
);
const store = new InMemoryMessageStore();

Deno.serve(req =>
  handleInbound(req, {
    authToken: Deno.env.get('TWILIO_AUTH_TOKEN'),
    webhookUrl: Deno.env.get('TWILIO_WEBHOOK_URL'),
    relayMap,
    allowedSenders,
    store,
    // Mock delivery: logs ids only (never the message body or phone numbers).
    notify: message => {
      console.log(
        `[support-relay-receive:mock-notify] user=${message.userId} sid=${message.messageSid}`,
      );
      return Promise.resolve();
    },
  }),
);
