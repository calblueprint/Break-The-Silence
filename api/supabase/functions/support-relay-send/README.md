# Twilio Outbound POC

# support-relay-send (Twilio outbound messaging POC)

POC for letting survivors message BTSADV through the app via per-user Twilio relay numbers, while volunteers keep using Talkroute.

```
Test User (JWT) -> support-relay-send -> assigned relay number -> Twilio (mocked by default)
```

## How it works

1. **Authenticate.** The Expo app calls the function with the user’s Supabase session token (`Authorization: Bearer <access_token>`). The function verifies it with `supabase.auth.getUser()`. Missing or invalid token -> `401`.
2. **Block spoofing.** If the request body contains `from` or `relayNumber`, it is rejected with `403`. A client can never choose the sender number.
3. **Validate.** `to` must be E.164 (e.g. `+15555550199`); `body` must be a non-empty string up to 1600 chars -> otherwise `400`.
4. **Select relay number.** The sender number is looked up from the **verified user id** in the relay map (`_shared/relay-map.ts`). No assigned number -> `403`.
5. **Send.** `_shared/twilio.ts` sends the SMS. Twilio failures return `502` with a generic message (provider details are logged server-side only, never returned).

Other responses: `405` for non-POST requests, `500` for unexpected errors.

Success response:

```json
{ "ok": true, "sid": "SMmock...", "status": "queued", "mocked": true, "from": "+15555550101" }
```

## Files

All paths are under `api/supabase/functions/`.

| File | Purpose |
| --- | --- |
| `support-relay-send/index.ts` | Edge Function entrypoint (wires Supabase auth, relay map, Twilio) |
| `support-relay-send/handler.ts` | Request logic, dependency-injected so it is testable |
| `support-relay-send/handler.test.ts` | 15 tests, no network needed |
| `_shared/twilio.ts` | Reusable `sendSms()` helper |
| `_shared/relay-map.ts` | Test user -> relay number mapping |
| `deno.json` | Intentionally minimal just to stop Deno from reading the Expo root `tsconfig.json` (`jsx: react-native`) |
| `.env.example` | Template of the settings the function reads (no real values) |

## Mock vs. real SMS

**Mock mode is the default.** `sendSms()` only calls Twilio when `TWILIO_MOCK=false` *and* `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` are set. In mock mode it logs the request and returns a fake `SM...` sid. Twilio credentials live only in Edge Function secrets, never in the Expo app.

## Relay mapping

The mapping is a plain `userId -> E.164 number` object. By default it uses two fake test users (`00000000-0000-0000-0000-00000000000a` -> `+15555550101`, `...00b` -> `+15555550102`). Real Supabase users have different ids, so to test with real users we must set `RELAY_NUMBER_MAP` to a JSON object using their ids:

```json
{ "<user-a-uuid>": "+15555550101", "<user-b-uuid>": "+15555550102" }
```

- **Local:** put `RELAY_NUMBER_MAP=<the JSON above on one line>` in `supabase/functions/.env` (loaded automatically by `supabase start`), or pass a file with `-env-file`. Do not commit this `.env`.
- **Hosted:** `supabase secrets set RELAY_NUMBER_MAP='<the JSON above>'`. This changes shared infrastructure, so need to check with charlotte and the rest of the team first.

The map is loaded on every request. If it is invalid (bad JSON or a non-E.164 number), requests fail with an error instead of sending from a bad number.

## Running it

Run the tests (requires [Deno](https://deno.com/)). Run them from the `functions` folder so Deno finds `deno.json`:

```bash
cd api/supabase/functions
deno test support-relay-send/
```

Run locally and try a mock send (from `api/`, where `supabase/config.toml` lives; Docker required):

1. Create two test users in the local Supabase Auth (Studio at `http://127.0.0.1:54323`) and copy their ids.
2. Put `RELAY_NUMBER_MAP` with those ids in `supabase/functions/.env` (see above).
3. Get an access token for each user by signing them in.
4. Start and call the function:

```bash
supabase start
supabase functions serve support-relay-send
curl -i http://127.0.0.1:54321/functions/v1/support-relay-send \
  -H "Authorization: Bearer <test-user-access-token>" \
  -H "Content-Type: application/json" \
  -d '{"to":"+15555550199","body":"Test message"}'
```

Check that the two users’ tokens return different `from` values.

## Test coverage

1. User A and user B each send from their own number
2. Spoofed `from`/`relayNumber` is rejected
3. Missing/malformed/invalid tokens -> 401
4. User without a number -> 403
5. Input validation -> 400
6. Wrong method -> 405
7. Twilio error -> 502 (no detail leak)
8. Unexpected error -> 500
9. Relay map parsing and prototype-key safety
10. Twilio helper builds the correct request (using a fake `fetch`) and never touches the network in mock mode.

## Known limitations (POC)

- Mapping is static config, not a database; no number provisioning.
- No rate limiting, delivery status callbacks, or message logging.
- Outbound only: no inbound webhook, no replies, no Talkroute integration.
- `to` is not restricted; in production it should be tied to the BTSADV line / a conversation record.
- Not tested against real Twilio or a live Supabase project yet (tests use injected fakes).

## Needed for next sprint

1. **Approval + Twilio access** to run a real test SMS (and to buy/assign relay numbers).
2. **`relay_numbers` table** (`user_id`, `relay_number`, `status`) with RLS replacing the static map.
3. **Inbound webhook** (`support-relay-receive`) with Twilio signature validation, mapping replies back to the right user.
4. **Talkroute integration** so volunteers see/answer messages in their existing tool.
5. **Conversation + message tables**, delivery status callbacks, and rate limiting / abuse protection.
6. **Number lifecycle**: provisioning, release, and handling users with no number.
7. Confirm the Talkroute/Twilio findings still hold (e.g. number types, A2P 10DLC registration requirements for US SMS) before provisioning.