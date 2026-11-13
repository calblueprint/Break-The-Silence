// Twilio webhook signature validation.
//
// Twilio signs every webhook request. The signature is a base64 HMAC-SHA1, keyed
// with your Twilio auth token, over: the full URL Twilio requested, followed by
// every POST parameter (sorted by name) as name+value. It arrives in the
// `X-Twilio-Signature` header.
// https://www.twilio.com/docs/usage/security#validating-requests
//
// Without this check anyone could POST a fake "reply" to the webhook URL.

const encoder = new TextEncoder();

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export async function computeTwilioSignature(
  authToken: string,
  url: string,
  params: URLSearchParams,
): Promise<string> {
  const entries = [...params.entries()].sort(
    ([aKey, aValue], [bKey, bValue]) =>
      compare(aKey, bKey) || compare(aValue, bValue),
  );
  const data = url + entries.map(([key, value]) => key + value).join('');

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(authToken),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/** Constant-time string comparison, so response timing can't leak the signature. */
function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}

export async function isValidTwilioSignature(
  authToken: string,
  url: string,
  params: URLSearchParams,
  signature: string | null,
): Promise<boolean> {
  if (!signature) return false;
  const expected = await computeTwilioSignature(authToken, url, params);
  return timingSafeEqual(expected, signature);
}
