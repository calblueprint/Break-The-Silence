// Simple relay-number mapping for the POC.
//
// Maps a Supabase auth user id -> the Twilio relay number assigned to them.
// Real numbers are NOT hardcoded: set RELAY_NUMBER_MAP as an Edge Function
// secret containing JSON, e.g.
//   {"<test-user-a-uuid>":"+15555550101","<test-user-b-uuid>":"+15555550102"}
//
// If unset, a clearly fake default mapping is used so mock runs and tests work.
// Next sprint this could become a DB table (user_id, relay_number, status).

export type RelayMap = Record<string, string>;

export const DEFAULT_TEST_MAP: RelayMap = {
  '00000000-0000-0000-0000-00000000000a': '+15555550101', // test user A
  '00000000-0000-0000-0000-00000000000b': '+15555550102', // test user B
};

const E164 = /^\+[1-9]\d{6,14}$/;

export function loadRelayMap(env: {
  get(k: string): string | undefined;
}): RelayMap {
  const raw = env.get('RELAY_NUMBER_MAP');
  if (!raw) return DEFAULT_TEST_MAP;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('RELAY_NUMBER_MAP is not valid JSON');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(
      'RELAY_NUMBER_MAP must be a JSON object of userId -> E.164 number',
    );
  }
  for (const [uid, num] of Object.entries(parsed)) {
    if (typeof num !== 'string' || !E164.test(num)) {
      throw new Error(`RELAY_NUMBER_MAP: invalid E.164 number for user ${uid}`);
    }
  }
  return parsed as RelayMap;
}

/** Returns the relay number assigned to this user, or null if none. */
export function getRelayNumberForUser(
  map: RelayMap,
  userId: string,
): string | null {
  return Object.prototype.hasOwnProperty.call(map, userId) ? map[userId] : null;
}

export function isValidE164(value: unknown): value is string {
  return typeof value === 'string' && E164.test(value);
}
