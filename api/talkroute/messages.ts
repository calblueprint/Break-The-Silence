/**
 * Talkroute text-messaging proof of concept.
 *
 * Covers the workflow an app needs for text messaging:
 *   1. verify auth                      GET  /v2/account
 *   2. check plan / feature access      GET  /v2/accounts/permitted-features
 *   3. list conversations               GET  /v2/text-conversations
 *   4. read messages in a conversation  GET  /v2/text-conversations/{id}/messages
 *   5. send a message                   POST /v2/text-conversations/{id}
 *   6. receive inbound texts            POST /v2/subscriptions (type: new_text_message)
 *
 * A conversation id is "<talkrouteNumber>-<contactNumber>", digits only, e.g.
 * "15105550100-14155550123" (NANP numbers, or a 5-6 digit short code for the
 * contact side). There is no separate "create conversation" call: POSTing to
 * a new id starts one.
 *
 * Run (needs a real key):
 *   TALKROUTE_API_KEY=tr_live_... npx tsx api/talkroute/messages.ts
 *   # optional: actually send one text (costs a real message):
 *   TALKROUTE_SEND_TO=+14155550123 TALKROUTE_FROM=+15105550100 \
 *     TALKROUTE_SEND_BODY="Test from POC" TALKROUTE_API_KEY=... npx tsx api/talkroute/messages.ts
 */

import { Paginated, TalkrouteClient, TalkrouteError } from './client.ts';

declare const process: {
  env: Record<string, string | undefined>;
  argv: string[];
  exitCode?: number;
};

// ---- Types (from the OpenAPI spec) ----------------------------------------

export interface Attachment {
  id: string;
  fileType: string;
  link: string;
  metadata?: {
    medium?: { height: number; width: number };
    original?: { height: number; width: number };
  };
}

export interface TextMessage {
  id: string;
  body: string;
  /** Spec does not enumerate values; webhooks use "incoming" | "outgoing". */
  direction: string;
  createdAt: string;
  read: boolean;
  userEmail?: string;
  attachments?: Attachment[];
}

export interface TextConversation {
  conversation_id: string;
  talkroute_number: string;
  contact_number: string;
  last_message_at: string;
  messages_count: number;
  last_message: TextMessage;
}

export interface ListConversationsParams {
  page?: number;
  pageSize?: number;
  /** ISO-8601 or unix timestamp: last message after this time. */
  since?: string;
  before?: string;
  unread?: boolean;
  talkrouteNumber?: string;
  senderNumber?: string;
}

/** Payload Talkroute POSTs to our hookUrl for `new_text_message`. */
export interface NewTextMessageWebhook {
  body: string;
  datetime: string;
  direction: 'incoming' | 'outgoing';
  from_number: string; // E.164
  to_number: string; // E.164
}

export interface SendAttachment {
  /** Base64 data URI, per the spec example: "data:image/jpeg;base64,/9j/4AAQ...". */
  content: string;
  /** MIME type, e.g. "image/jpeg". Only image MMS is supported. */
  fileType: string;
  /** 32-char hex string in the spec example (looks like MD5; algorithm not stated). Verify with a live call. */
  hash: string;
}

// ---- Helpers ---------------------------------------------------------------

/** "+15105550100" -> "15105550100". Accepts US/Canada numbers or short codes. */
function digits(n: string): string {
  return n.replace(/\D/g, '');
}

/** Build the conversation id: "<talkrouteNumber>-<contactNumber>". */
export function conversationId(
  talkrouteNumber: string,
  contactNumber: string,
): string {
  const id = `${digits(talkrouteNumber)}-${digits(contactNumber)}`;
  // Pattern from the spec.
  if (
    !/^1[2-9]\d{2}[2-9]\d{6}-(1[2-9]\d{2}[2-9]\d{6}|[2-9]\d{4,5})$/.test(id)
  ) {
    throw new Error(
      `Invalid conversation id "${id}". Numbers must be NANP with country code 1 (or a 5-6 digit short code for the contact).`,
    );
  }
  return id;
}

// ---- Messaging API ----------------------------------------------------------

export class TalkrouteMessages {
  constructor(private readonly client: TalkrouteClient) {}

  listConversations(params: ListConversationsParams = {}) {
    return this.client.get<Paginated<TextConversation>>(
      '/v2/text-conversations',
      { ...params },
    );
  }

  getMessages(convId: string, page?: number, pageSize?: number) {
    return this.client.get<Paginated<TextMessage>>(
      `/v2/text-conversations/${encodeURIComponent(convId)}/messages`,
      { page, pageSize },
    );
  }

  /** Sends a text. Returns the created message (HTTP 201). */
  send(convId: string, body: string, attachment?: SendAttachment) {
    return this.client.post<TextMessage>(
      `/v2/text-conversations/${encodeURIComponent(convId)}`,
      {
        body,
        ...(attachment ? { attachment } : {}),
      },
    );
  }

  /** Register a webhook so inbound texts are pushed to your server. */
  subscribeToInbound(hookUrl: string) {
    return this.client.createSubscription('new_text_message', hookUrl);
  }
}

/**
 * Minimal webhook handler (framework-agnostic). The spec documents no
 * signature/HMAC header, so authenticity can't be verified from the docs;
 * use an unguessable hookUrl path/token and an allow-check on the payload.
 */
export function parseNewTextWebhook(raw: unknown): NewTextMessageWebhook {
  const p = raw as Partial<NewTextMessageWebhook>;
  if (
    !p ||
    typeof p.body !== 'string' ||
    !p.from_number ||
    !p.to_number ||
    !p.direction
  ) {
    throw new Error('Not a Talkroute new_text_message payload');
  }
  return p as NewTextMessageWebhook;
}

// ---- POC runner ----------------------------------------------------------------

async function step<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T | undefined> {
  try {
    const out = await fn();
    console.log(`PASS  ${label}`);
    return out;
  } catch (e) {
    if (e instanceof TalkrouteError) {
      console.log(`FAIL  ${label} -> HTTP ${e.status}: ${e.message}`);
    } else {
      console.log(`FAIL  ${label} -> ${(e as Error).message}`);
    }
    return undefined;
  }
}

async function main() {
  const client = new TalkrouteClient();
  const messages = new TalkrouteMessages(client);

  // 1. Auth
  const account = await step('auth: GET /v2/account', () =>
    client.getAccount(),
  );
  if (!account) {
    console.log('Stopping: authentication failed. Check TALKROUTE_API_KEY.');
    process.exitCode = 1;
    return;
  }
  console.log(
    `      account=${account.data.name} trial=${account.data.trial} pastDue=${account.data.isPastDue}`,
  );

  // 2. Plan / features: see whether texting is allowed on this account
  const features = await step(
    'features: GET /v2/accounts/permitted-features',
    () => client.getPermittedFeatures(),
  );
  for (const f of features?.data ?? []) {
    if (/text|sms|messag/i.test(`${f.name} ${f.display_name}`)) {
      console.log(
        `      feature "${f.display_name}": allowed=${f.allowed} used=${f.used}/${f.included}`,
      );
    }
  }

  // 3. Retrieve conversations, then messages from the first one
  const convs = await step('read: GET /v2/text-conversations', () =>
    messages.listConversations({ pageSize: 5 }),
  );
  const first = convs?.data[0];
  if (first) {
    const msgs = await step(
      `read: GET messages for ${first.conversation_id}`,
      () => messages.getMessages(first.conversation_id, 1, 5),
    );
    console.log(
      `      ${msgs?.data.length ?? 0} message(s) fetched (total ${msgs?.pagination.total})`,
    );
  } else {
    console.log('      no conversations on this account yet');
  }

  // 4. Send (opt-in only; sends a real, billable text)
  const to = process.env.TALKROUTE_SEND_TO;
  const from = process.env.TALKROUTE_FROM;
  if (to && from) {
    const id = conversationId(from, to);
    const sent = await step(`send: POST /v2/text-conversations/${id}`, () =>
      messages.send(
        id,
        process.env.TALKROUTE_SEND_BODY ?? 'Talkroute API test message',
      ),
    );
    if (sent)
      console.log(`      sent message id=${sent.id} at ${sent.createdAt}`);
  } else {
    console.log(
      'SKIP  send (set TALKROUTE_FROM and TALKROUTE_SEND_TO to enable)',
    );
  }

  // 5. Webhooks: list only (creating one changes account config)
  await step('webhooks: GET /v2/subscriptions', () =>
    client.listSubscriptions(),
  );
}

// Run only when executed directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  });
}
