import type { InboundMessage } from '../_shared/inbound-store.ts';
import type { InboundDeps } from './handler.ts';
import assert from 'node:assert/strict';
import { InMemoryMessageStore } from '../_shared/inbound-store.ts';
import { getUserForRelayNumber } from '../_shared/relay-lookup.ts';
import { DEFAULT_TEST_MAP } from '../_shared/relay-map.ts';
import {
  computeTwilioSignature,
  isValidTwilioSignature,
} from '../_shared/twilio-signature.ts';
import { handleInbound, parseAllowedSenders } from './handler.ts';

// node:assert is built into Deno, so the tests need no external dependencies.
const assertEquals = (actual: unknown, expected: unknown, msg?: string) =>
  assert.deepStrictEqual(actual, expected, msg);

const AUTH_TOKEN = 'test-auth-token';
const WEBHOOK_URL =
  'https://example.supabase.co/functions/v1/support-relay-receive';

const USER_A = '00000000-0000-0000-0000-00000000000a';
const USER_B = '00000000-0000-0000-0000-00000000000b';
const RELAY_A = '+15555550101';
const RELAY_B = '+15555550102';
const BTSADV = '+15555550900'; // stands in for BTSADV's Talkroute number
const STRANGER = '+15555550777';

function makeDeps(overrides: Partial<InboundDeps> = {}) {
  const store = new InMemoryMessageStore();
  const notified: InboundMessage[] = [];
  const deps: InboundDeps = {
    authToken: AUTH_TOKEN,
    webhookUrl: WEBHOOK_URL,
    relayMap: DEFAULT_TEST_MAP,
    allowedSenders: [BTSADV],
    store,
    notify: m => {
      notified.push(m);
      return Promise.resolve();
    },
    ...overrides,
  };
  return { deps, store, notified };
}

function fields(
  overrides: Record<string, string> = {},
): Record<string, string> {
  return {
    MessageSid: 'SM' + 'a'.repeat(32),
    From: BTSADV,
    To: RELAY_A,
    Body: 'Hi, a volunteer here. How can we help?',
    ...overrides,
  };
}

async function signedRequest(
  f: Record<string, string>,
  opts: { token?: string; url?: string } = {},
): Promise<Request> {
  const params = new URLSearchParams(f);
  const signature = await computeTwilioSignature(
    opts.token ?? AUTH_TOKEN,
    opts.url ?? WEBHOOK_URL,
    params,
  );
  return new Request(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Twilio-Signature': signature,
    },
    body: params.toString(),
  });
}

// ---- delivery ----

Deno.test('reply to relay A is stored for user A only', async () => {
  const { deps, store, notified } = makeDeps();
  const res = await handleInbound(await signedRequest(fields()), deps);
  assertEquals(res.status, 200);
  assertEquals((await store.listForUser(USER_A)).length, 1);
  assertEquals((await store.listForUser(USER_B)).length, 0);
  assertEquals(notified.length, 1);
  assertEquals(notified[0].userId, USER_A);
});

Deno.test('reply to relay B is stored for user B only', async () => {
  const { deps, store } = makeDeps();
  const res = await handleInbound(
    await signedRequest(
      fields({ MessageSid: 'SM' + 'b'.repeat(32), To: RELAY_B }),
    ),
    deps,
  );
  assertEquals(res.status, 200);
  assertEquals((await store.listForUser(USER_B)).length, 1);
  assertEquals((await store.listForUser(USER_A)).length, 0);
});

Deno.test('two users get their own replies, not each other’s', async () => {
  const { deps, store } = makeDeps();
  await handleInbound(await signedRequest(fields({ Body: 'for A' })), deps);
  await handleInbound(
    await signedRequest(
      fields({ MessageSid: 'SM' + 'b'.repeat(32), To: RELAY_B, Body: 'for B' }),
    ),
    deps,
  );
  assertEquals(
    (await store.listForUser(USER_A)).map(m => m.body),
    ['for A'],
  );
  assertEquals(
    (await store.listForUser(USER_B)).map(m => m.body),
    ['for B'],
  );
});

Deno.test(
  'success returns empty TwiML so Twilio sends no automatic reply',
  async () => {
    const { deps } = makeDeps();
    const res = await handleInbound(await signedRequest(fields()), deps);
    assertEquals(res.status, 200);
    assert.ok(res.headers.get('content-type')?.includes('text/xml'));
    assert.ok((await res.text()).includes('<Response></Response>'));
  },
);

// ---- signature ----

Deno.test(
  'missing signature is rejected with 403 and nothing is stored',
  async () => {
    const { deps, store, notified } = makeDeps();
    const req = new Request(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields()).toString(),
    });
    assertEquals((await handleInbound(req, deps)).status, 403);
    assertEquals((await store.listForUser(USER_A)).length, 0);
    assertEquals(notified.length, 0);
  },
);

Deno.test('signature made with the wrong token is rejected', async () => {
  const { deps, store } = makeDeps();
  const res = await handleInbound(
    await signedRequest(fields(), { token: 'attacker' }),
    deps,
  );
  assertEquals(res.status, 403);
  assertEquals((await store.listForUser(USER_A)).length, 0);
});

Deno.test('signature for a different URL is rejected', async () => {
  const { deps } = makeDeps();
  const res = await handleInbound(
    await signedRequest(fields(), { url: 'https://evil.example/hook' }),
    deps,
  );
  assertEquals(res.status, 403);
});

Deno.test('a body tampered with after signing is rejected', async () => {
  const { deps, store } = makeDeps();
  const params = new URLSearchParams(fields());
  const signature = await computeTwilioSignature(
    AUTH_TOKEN,
    WEBHOOK_URL,
    params,
  );
  params.set('To', RELAY_B); // changed after signing
  const req = new Request(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'X-Twilio-Signature': signature },
    body: params.toString(),
  });
  assertEquals((await handleInbound(req, deps)).status, 403);
  assertEquals((await store.listForUser(USER_B)).length, 0);
});

Deno.test(
  'fails closed (500) when the auth token or webhook URL is not configured',
  async () => {
    for (const overrides of [
      { authToken: undefined },
      { webhookUrl: undefined },
      { authToken: '' },
    ]) {
      const { deps, store } = makeDeps(overrides);
      const res = await handleInbound(await signedRequest(fields()), deps);
      assertEquals(res.status, 500);
      assertEquals((await store.listForUser(USER_A)).length, 0);
    }
  },
);

Deno.test('non-POST returns 405', async () => {
  const { deps } = makeDeps();
  assertEquals(
    (await handleInbound(new Request(WEBHOOK_URL), deps)).status,
    405,
  );
});

Deno.test(
  'signature matches the example in Twilio’s docs and is order-independent',
  async () => {
    const url = 'https://mycompany.com/myapp.php?foo=1&bar=2';
    const params = new URLSearchParams([
      ['Digits', '1234'],
      ['To', '+18005551212'],
      ['From', '+14158675310'],
      ['Caller', '+14158675310'],
      ['CallSid', 'CA1234567890ABCDE'],
    ]);
    const expected = 'GvWf1cFY/Q7PnoempGyD5oXAezc=';
    assertEquals(await computeTwilioSignature('12345', url, params), expected);
    assertEquals(
      await isValidTwilioSignature('12345', url, params, expected),
      true,
    );
    assertEquals(
      await isValidTwilioSignature('12345', url, params, null),
      false,
    );
    assertEquals(
      await isValidTwilioSignature('12345', url, params, 'nope'),
      false,
    );
  },
);

// ---- validation ----

Deno.test(
  'malformed fields return 400 (signed correctly, so the request is genuine)',
  async () => {
    const { deps, store } = makeDeps();
    const badInputs: Record<string, string>[] = [
      { MessageSid: '' },
      { MessageSid: 'S'.repeat(65) },
      { From: '5550100' },
      { To: 'not-a-number' },
    ];
    for (const bad of badInputs) {
      const res = await handleInbound(await signedRequest(fields(bad)), deps);
      assertEquals(res.status, 400, JSON.stringify(bad));
    }
    assertEquals((await store.listForUser(USER_A)).length, 0);
  },
);

// ---- who may reach a survivor ----

Deno.test(
  'a sender that is not on the allowlist is dropped (200) and never delivered',
  async () => {
    const { deps, store, notified } = makeDeps();
    const res = await handleInbound(
      await signedRequest(fields({ From: STRANGER })),
      deps,
    );
    assertEquals(res.status, 200);
    assertEquals((await store.listForUser(USER_A)).length, 0);
    assertEquals(notified.length, 0);
  },
);

Deno.test('an empty allowlist drops everything', async () => {
  const { deps, store } = makeDeps({ allowedSenders: [] });
  await handleInbound(await signedRequest(fields()), deps);
  assertEquals((await store.listForUser(USER_A)).length, 0);
});

Deno.test('an unknown relay number is dropped', async () => {
  const { deps, notified } = makeDeps();
  const res = await handleInbound(
    await signedRequest(fields({ To: '+15555550999' })),
    deps,
  );
  assertEquals(res.status, 200);
  assertEquals(notified.length, 0);
});

Deno.test(
  'a relay number mapped to two users is dropped, not guessed',
  async () => {
    const shared = { [USER_A]: RELAY_A, [USER_B]: RELAY_A };
    const { deps, store, notified } = makeDeps({ relayMap: shared });
    await handleInbound(await signedRequest(fields()), deps);
    assertEquals((await store.listForUser(USER_A)).length, 0);
    assertEquals((await store.listForUser(USER_B)).length, 0);
    assertEquals(notified.length, 0);
  },
);

Deno.test('an empty or whitespace-only body is dropped', async () => {
  const { deps, notified } = makeDeps();
  await handleInbound(await signedRequest(fields({ Body: '   ' })), deps);
  await handleInbound(await signedRequest(fields({ Body: '' })), deps);
  assertEquals(notified.length, 0);
});

// ---- duplicates and failures ----

Deno.test(
  'the same MessageSid delivered twice is stored and notified once',
  async () => {
    const { deps, store, notified } = makeDeps();
    assertEquals(
      (await handleInbound(await signedRequest(fields()), deps)).status,
      200,
    );
    assertEquals(
      (await handleInbound(await signedRequest(fields()), deps)).status,
      200,
    );
    assertEquals((await store.listForUser(USER_A)).length, 1);
    assertEquals(notified.length, 1);
  },
);

Deno.test(
  'a failed notification still returns 200 and the message stays stored',
  async () => {
    const { deps, store } = makeDeps({
      notify: () => Promise.reject(new Error('push down')),
    });
    const res = await handleInbound(await signedRequest(fields()), deps);
    assertEquals(res.status, 200);
    assertEquals((await store.listForUser(USER_A)).length, 1);
  },
);

Deno.test('a store failure returns 500 and does not notify', async () => {
  const { deps, notified } = makeDeps({
    store: {
      saveIfNew: () => Promise.reject(new Error('db down')),
      listForUser: () => Promise.resolve([]),
    },
  });
  const res = await handleInbound(await signedRequest(fields()), deps);
  assertEquals(res.status, 500);
  assertEquals(notified.length, 0);
});

// ---- helpers ----

Deno.test('parseAllowedSenders handles lists, blanks and bad entries', () => {
  assertEquals(parseAllowedSenders(undefined), []);
  assertEquals(parseAllowedSenders(''), []);
  assertEquals(parseAllowedSenders(' +15555550900 , +15555550901 '), [
    '+15555550900',
    '+15555550901',
  ]);
  assert.throws(() => parseAllowedSenders('+15555550900,12345'));
});

Deno.test('getUserForRelayNumber: unique match only', () => {
  assertEquals(getUserForRelayNumber(DEFAULT_TEST_MAP, RELAY_A), USER_A);
  assertEquals(getUserForRelayNumber(DEFAULT_TEST_MAP, RELAY_B), USER_B);
  assertEquals(getUserForRelayNumber(DEFAULT_TEST_MAP, '+15555550999'), null);
  assertEquals(
    getUserForRelayNumber({ x: RELAY_A, y: RELAY_A }, RELAY_A),
    null,
  );
  assertEquals(getUserForRelayNumber({}, RELAY_A), null);
});
