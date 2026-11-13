# support-relay-receive (Twilio inbound messaging POC)

Backend POC for the return path of the support relay: a volunteer replies from Talkroute, and the reply reaches the right survivor in the app.

```
Volunteer (Talkroute) -> SMS to relay number -> Twilio -> support-relay-receive
  -> verify signature -> allowlist sender -> find the user who owns the relay number
  -> store (deduped) -> notify the app (mocked)
```

## How it works

Everything runs in `handler.ts`, in this order:

1. **Method check.** Only `POST` is accepted (`405` otherwise).
2. **Fail closed.** If `TWILIO_AUTH_TOKEN` or `TWILIO_WEBHOOK_URL` is not configured, nothing can be verified, so every request gets `500` and nothing is stored.
3. **Verify the Twilio signature.** Twilio signs each webhook (`X-Twilio-Signature`, an HMAC-SHA1 keyed with our auth token over the URL plus the sorted form fields). Missing or wrong signature -> `403`. This runs before anything in the request is trusted.
4. **Validate fields.** `MessageSid`, `From` and `To` must be present and well-formed (`From`/`To` E.164) -> otherwise `400`.
5. **Sender allowlist.** Only numbers in `INBOUND_ALLOWED_SENDERS` (BTSADV's Talkroute number) may reach a survivor. A relay number is an ordinary phone number, so without this anyone who texted it would land in the survivor's inbox.
6. **Find the user.** The `To` number is looked up in the relay map (`_shared/relay-lookup.ts`). Exactly one user must own it. If not, the message is dropped.
7. **Dedupe and store.** Twilio can send the same message more than once, so the store ignores a repeated `MessageSid`.
8. **Notify (mock).** A best-effort nudge to the app. The store is the source of truth, so a failed nudge is logged but does not fail the request.
9. **Reply with empty TwiML** so Twilio sends no automatic reply.

### Responses

| Status | When                                                                                                     |
| ------ | -------------------------------------------------------------------------------------------------------- |
| `200`  | Delivered, **or** deliberately dropped (sender not allowed, unknown relay number, empty body, duplicate) |
| `400`  | Genuine Twilio request with malformed fields                                                             |
| `403`  | Missing or invalid signature                                                                             |
| `405`  | Not a POST                                                                                               |
| `500`  | Not configured, or the store failed                                                                      |

Dropped messages return `200` (not an error) so Twilio does not flag or retry them. The reason is logged as a short code.

## Safety design

This is a survivor support line, so by default, I implemented strict rules:

- **Signature check** stops anyone who finds the webhook URL from posting fake replies.
- **Sender allowlist** stops strangers (or an abuser who learns a relay number) from texting into a survivor's inbox. An empty allowlist drops everything.
- **Unambiguous routing**: a number mapped to two users is dropped instead of delivered to one of them.
- **No sensitive logging**: logs contain only reason codes, user ids and message ids, never actual message text or phone numbers.
- **Fail closed** on missing configuration.

## Configuration

See `.env.example`. All values below are Edge Function secrets, and should never show in the Expo app.

| Name                      | Purpose                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `TWILIO_AUTH_TOKEN`       | Verifies webhook signatures (same token the outbound function uses for real sends)       |
| `TWILIO_WEBHOOK_URL`      | The exact public URL set in Twilio for this webhook, including any query string          |
| `INBOUND_ALLOWED_SENDERS` | Comma-separated E.164 numbers allowed to reach survivors, e.g. BTSADV's Talkroute number |
| `RELAY_NUMBER_MAP`        | Same user -> relay number map as `support-relay-send` (defaults to two fake test users)  |

`TWILIO_WEBHOOK_URL` must match what Twilio signed. Supabase's gateway can rewrite the URL a function sees, so the handler uses this configured value and not `req.url`.

### Deploying: JWT verification must be off for this function

Twilio cannot send a Supabase login token, so Supabase's default JWT check would reject every webhook. Turn it off for this function only; the signature check replaces it:

```bash
supabase functions deploy support-relay-receive --no-verify-jwt
```

or in `supabase/config.toml`:

```toml
[functions.support-relay-receive]
verify_jwt = false
```

Do not turn it off for `support-relay-send` as it relies on the user's token.

## Running it

Run the tests (requires [Deno](https://deno.com)) from the `functions` folder so Deno finds `deno.json`:

```bash
cd api/supabase/functions
deno test support-relay-receive/
```

Try it locally without Twilio. `sign-request.ts` prints a curl command with a valid signature. Use test values only:

```bash
cd api/supabase/functions
# 1. Put test values in supabase/functions/.env (not committed):
#    TWILIO_AUTH_TOKEN=test-token
#    TWILIO_WEBHOOK_URL=http://127.0.0.1:54321/functions/v1/support-relay-receive
#    INBOUND_ALLOWED_SENDERS=+15555550900
# 2. Serve it (from api/, where supabase/config.toml lives):
supabase functions serve support-relay-receive --no-verify-jwt
# 3. In another terminal, generate and send a signed fake reply:
TWILIO_AUTH_TOKEN=test-token \
TWILIO_WEBHOOK_URL=http://127.0.0.1:54321/functions/v1/support-relay-receive \
deno run --allow-env support-relay-receive/sign-request.ts --body "Hello from a volunteer"
```

Run the printed curl. Expect `200` and a `[support-relay-receive:mock-notify]` line in the function logs. Sending the same request again is ignored as a duplicate, and a request without the signature header returns `403`.

## Test coverage

22 tests:
- A reply to relay A or B reaches only that user
- empty TwiML on success
- missing, wrong-token, wrong-URL and tampered signatures -> 403
- the signature code matches the example in Twilio's docs
- fail-closed on missing config -> 405
- malformed fields -> 400
- sender not on the allowlist, empty allowlist, unknown relay number, a number mapped to two users, and an empty body are all dropped
- duplicate `MessageSid` delivered once
- a failed notification still returns 200
- a store failure returns 500