import type { Deps } from './handler.ts';
import assert from 'node:assert/strict';
import {
  DEFAULT_TEST_MAP,
  getRelayNumberForUser,
  loadRelayMap,
} from '../_shared/relay-map.ts';
import { sendSms, TwilioError } from '../_shared/twilio.ts';
import { handleRequest } from './handler.ts';

// node:assert is built into Deno, so the tests need no external dependencies.
const assertEquals = (actual: unknown, expected: unknown, msg?: string) =>
  assert.deepStrictEqual(actual, expected, msg);

const USER_A = '00000000-0000-0000-0000-00000000000a';
const USER_B = '00000000-0000-0000-0000-00000000000b';
const USER_NO_NUMBER = '00000000-0000-0000-0000-00000000000c';

const TOKENS: Record<string, string> = {
  'token-a': USER_A,
  'token-b': USER_B,
  'token-c': USER_NO_NUMBER,
};

function makeDeps(overrides: Partial<Deps> = {}) {
  const sent: { from: string; to: string; body: string }[] = [];
  const deps: Deps = {
    authenticate: t => Promise.resolve(TOKENS[t] ? { id: TOKENS[t] } : null),
    relayMap: DEFAULT_TEST_MAP,
    send: p => {
      sent.push(p);
      return Promise.resolve({
        sid: 'SMmock123',
        status: 'queued',
        mocked: true,
      });
    },
    ...overrides,
  };
  return { deps, sent };
}

function post(body: unknown, token?: string, raw = false) {
  return new Request('http://localhost/support-relay-send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

const msg = { to: '+15555550199', body: 'Hello from the app' };

Deno.test('user A sends from relay number A', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleRequest(post(msg, 'token-a'), deps);
  assertEquals(res.status, 200);
  assertEquals((await res.json()).from, '+15555550101');
  assertEquals(sent.length, 1);
  assertEquals(sent[0].from, '+15555550101');
});

Deno.test('user B sends from relay number B', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleRequest(post(msg, 'token-b'), deps);
  assertEquals(res.status, 200);
  assertEquals(sent[0].from, '+15555550102');
});

Deno.test(
  "client cannot supply another user's number (from / relayNumber)",
  async () => {
    const { deps, sent } = makeDeps();
    for (const field of ['from', 'relayNumber']) {
      const res = await handleRequest(
        post({ ...msg, [field]: '+15555550102' }, 'token-a'),
        deps,
      );
      assertEquals(res.status, 403);
    }
    assertEquals(sent.length, 0);
  },
);

Deno.test('missing, malformed, and invalid tokens return 401', async () => {
  const { deps, sent } = makeDeps();
  assertEquals((await handleRequest(post(msg), deps)).status, 401);
  const bad = new Request('http://localhost/', {
    method: 'POST',
    headers: { Authorization: 'Basic abc' },
    body: JSON.stringify(msg),
  });
  assertEquals((await handleRequest(bad, deps)).status, 401);
  assertEquals((await handleRequest(post(msg, 'nope'), deps)).status, 401);
  assertEquals(sent.length, 0);
});

Deno.test('authenticate throwing is treated as 401', async () => {
  const { deps } = makeDeps({
    authenticate: () => Promise.reject(new Error('boom')),
  });
  assertEquals((await handleRequest(post(msg, 'token-a'), deps)).status, 401);
});

Deno.test(
  'authenticated user with no assigned relay number gets 403',
  async () => {
    const { deps, sent } = makeDeps();
    const res = await handleRequest(post(msg, 'token-c'), deps);
    assertEquals(res.status, 403);
    assertEquals(sent.length, 0);
  },
);

Deno.test('input validation returns 400', async () => {
  const { deps, sent } = makeDeps();
  assertEquals(
    (await handleRequest(post({ body: 'hi' }, 'token-a'), deps)).status,
    400,
  );
  assertEquals(
    (await handleRequest(post({ to: '5550199', body: 'hi' }, 'token-a'), deps))
      .status,
    400,
  );
  assertEquals(
    (await handleRequest(post({ to: msg.to, body: '   ' }, 'token-a'), deps))
      .status,
    400,
  );
  assertEquals(
    (
      await handleRequest(
        post({ to: msg.to, body: 'x'.repeat(1601) }, 'token-a'),
        deps,
      )
    ).status,
    400,
  );
  assertEquals(
    (await handleRequest(post('not json', 'token-a', true), deps)).status,
    400,
  );
  assertEquals(
    (await handleRequest(post([1, 2], 'token-a'), deps)).status,
    400,
  );
  assertEquals(sent.length, 0);
});

Deno.test('non-POST returns 405', async () => {
  const { deps } = makeDeps();
  const res = await handleRequest(
    new Request('http://localhost/', { method: 'GET' }),
    deps,
  );
  assertEquals(res.status, 405);
});

Deno.test('Twilio error maps to 502 without leaking details', async () => {
  const { deps } = makeDeps({
    send: () =>
      Promise.reject(new TwilioError('Account SID AC123 invalid', 401)),
  });
  const res = await handleRequest(post(msg, 'token-a'), deps);
  assertEquals(res.status, 502);
  assertEquals((await res.text()).includes('AC123'), false);
});

Deno.test('unexpected error maps to 500', async () => {
  const { deps } = makeDeps({
    send: () => Promise.reject(new Error('kaboom')),
  });
  assertEquals((await handleRequest(post(msg, 'token-a'), deps)).status, 500);
});

// ---- relay map ----

Deno.test('relay map: lookup, prototype keys, and env parsing', () => {
  assertEquals(getRelayNumberForUser(DEFAULT_TEST_MAP, USER_A), '+15555550101');
  assertEquals(getRelayNumberForUser(DEFAULT_TEST_MAP, 'unknown'), null);
  assertEquals(getRelayNumberForUser(DEFAULT_TEST_MAP, '__proto__'), null);
  assertEquals(getRelayNumberForUser(DEFAULT_TEST_MAP, 'constructor'), null);

  const env = (v?: string) => ({
    get: (k: string) => (k === 'RELAY_NUMBER_MAP' ? v : undefined),
  });
  assertEquals(loadRelayMap(env()), DEFAULT_TEST_MAP);
  assertEquals(loadRelayMap(env('{"u1":"+15555550111"}')), {
    u1: '+15555550111',
  });
});

Deno.test('relay map: rejects bad config', () => {
  const env = (v: string) => ({ get: () => v });
  for (const bad of ['not json', '[]', '{"u1":"12345"}', '{"u1":5}']) {
    let threw = false;
    try {
      loadRelayMap(env(bad));
    } catch {
      threw = true;
    }
    assertEquals(threw, true, `expected throw for ${bad}`);
  }
});

// ---- twilio helper ----

Deno.test(
  'twilio: mock mode is the default and makes no network call',
  async () => {
    let called = false;
    const fakeFetch = (() => {
      called = true;
      return Promise.resolve(new Response('{}'));
    }) as typeof fetch;
    const env = { get: () => undefined };
    const r = await sendSms(
      { from: '+15555550101', to: '+15555550199', body: 'hi' },
      env,
      fakeFetch,
    );
    assertEquals(r.mocked, true);
    assertEquals(called, false);
  },
);

Deno.test('twilio: real mode requires credentials', async () => {
  const env = {
    get: (k: string) => (k === 'TWILIO_MOCK' ? 'false' : undefined),
  };
  let threw = false;
  try {
    await sendSms(
      { from: '+15555550101', to: '+15555550199', body: 'hi' },
      env,
    );
  } catch (e) {
    threw = e instanceof TwilioError;
  }
  assertEquals(threw, true);
});

Deno.test(
  'twilio: real mode builds the correct request (fake fetch, no real SMS)',
  async () => {
    const vars: Record<string, string> = {
      TWILIO_MOCK: 'false',
      TWILIO_ACCOUNT_SID: 'ACtest',
      TWILIO_AUTH_TOKEN: 'tok',
    };
    const env = { get: (k: string) => vars[k] };
    let captured: { url: string; init: RequestInit } | undefined;
    const fakeFetch = ((url: string, init: RequestInit) => {
      captured = { url, init };
      return Promise.resolve(
        new Response(JSON.stringify({ sid: 'SM1', status: 'queued' }), {
          status: 201,
        }),
      );
    }) as unknown as typeof fetch;

    const r = await sendSms(
      { from: '+15555550101', to: '+15555550199', body: 'hi' },
      env,
      fakeFetch,
    );
    assertEquals(r, { sid: 'SM1', status: 'queued', mocked: false });
    assertEquals(
      captured!.url,
      'https://api.twilio.com/2010-04-01/Accounts/ACtest/Messages.json',
    );
    const form = captured!.init.body as URLSearchParams;
    assertEquals(form.get('From'), '+15555550101');
    assertEquals(form.get('To'), '+15555550199');
  },
);
