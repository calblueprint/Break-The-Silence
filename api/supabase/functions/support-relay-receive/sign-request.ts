// Prints a curl command for a correctly signed fake Twilio inbound webhook, so you
// can test support-relay-receive locally without Twilio (Twilio can't reach localhost).
//
// The URL and auth token must match what the running function has in
// TWILIO_WEBHOOK_URL and TWILIO_AUTH_TOKEN. Use test values only.
//
// Usage (from api/supabase/functions):
//   TWILIO_AUTH_TOKEN=test-token \
//   TWILIO_WEBHOOK_URL=http://127.0.0.1:54321/functions/v1/support-relay-receive \
//   deno run --allow-env support-relay-receive/sign-request.ts \
//     --from +15555550900 --to +15555550101 --body "Hello from a volunteer"

import { parseArgs } from 'node:util';
import { computeTwilioSignature } from '../_shared/twilio-signature.ts';

const { values } = parseArgs({
  options: {
    from: { type: 'string', default: '+15555550900' },
    to: { type: 'string', default: '+15555550101' },
    body: { type: 'string', default: 'Test reply from a volunteer' },
    sid: { type: 'string' },
  },
});

const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const url = Deno.env.get('TWILIO_WEBHOOK_URL');
if (!authToken || !url) {
  console.error(
    'Set TWILIO_AUTH_TOKEN and TWILIO_WEBHOOK_URL (test values only).',
  );
  Deno.exit(1);
}

const params = new URLSearchParams({
  MessageSid: values.sid ?? 'SM' + crypto.randomUUID().replaceAll('-', ''),
  From: values.from!,
  To: values.to!,
  Body: values.body!,
});
const signature = await computeTwilioSignature(authToken, url, params);

// URLSearchParams percent-encodes quotes, so the body is safe inside single quotes.
console.log(
  [
    `curl -i '${url}'`,
    `  -H 'Content-Type: application/x-www-form-urlencoded'`,
    `  -H 'X-Twilio-Signature: ${signature}'`,
    `  --data-raw '${params.toString()}'`,
  ].join(' \\\n'),
);
