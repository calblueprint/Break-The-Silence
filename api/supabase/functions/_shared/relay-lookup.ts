// Reverse lookup for inbound messages: which user owns this relay number?
//
// A reply is delivered to exactly one survivor, so the lookup must be
// unambiguous. If no user, or more than one user, is mapped to the number we
// return null and the caller drops the message rather than guessing.

import type { RelayMap } from './relay-map.ts';

export function getUserForRelayNumber(
  map: RelayMap,
  relayNumber: string,
): string | null {
  const matches = Object.entries(map).filter(
    ([, number]) => number === relayNumber,
  );
  return matches.length === 1 ? matches[0][0] : null;
}
