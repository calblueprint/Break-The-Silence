// Message storage for inbound replies (POC).
//
// The in-memory store is only for the POC: Edge Function instances are
// short-lived and not shared, so messages and duplicate-detection do not
// survive a restart or span instances. Next sprint this becomes a table with a
// unique constraint on message_sid (see the README).

export interface InboundMessage {
  messageSid: string;
  userId: string;
  from: string;
  to: string;
  body: string;
  receivedAt: string;
}

export interface MessageStore {
  /** Saves the message unless one with the same sid already exists. Returns true if it was saved. */
  saveIfNew(message: InboundMessage): Promise<boolean>;
  listForUser(userId: string): Promise<InboundMessage[]>;
}

export class InMemoryMessageStore implements MessageStore {
  private messages = new Map<string, InboundMessage>();

  saveIfNew(message: InboundMessage): Promise<boolean> {
    if (this.messages.has(message.messageSid)) return Promise.resolve(false);
    this.messages.set(message.messageSid, message);
    return Promise.resolve(true);
  }

  listForUser(userId: string): Promise<InboundMessage[]> {
    return Promise.resolve(
      [...this.messages.values()].filter(m => m.userId === userId),
    );
  }
}
