/**
 * Talkroute API client (v2.0.2, OpenAPI 3.1)
 *
 * Spec:     https://apidocs.talkroute.com/talkroute-api-ref.json
 * Base URL: https://api.talkroute.com/api
 * Auth:     API key sent as a Bearer token. Format: tr_live_<64 hex chars>.
 *
 * Reads TALKROUTE_API_KEY (and optionally TALKROUTE_BASE_URL) from the
 * environment.
 */

declare const process: { env: Record<string, string | undefined> };

export const DEFAULT_BASE_URL = "https://api.talkroute.com/api";

export interface Pagination {
  count: number;
  currentPage: number;
  firstPageUrl: string;
  from: number;
  lastPageUrl: string;
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

export interface TalkrouteClientOptions {
  apiKey?: string;
  baseUrl?: string;
  /** Per-request timeout in ms. Default 15000. */
  timeoutMs?: number;
  /** Injectable for tests. Defaults to global fetch. */
  fetchImpl?: typeof fetch;
}

/**
 * Error thrown for any non-2xx response. Status meanings per the spec for the
 * text endpoints:
 *   401 Unauthorized (missing/invalid key)
 *   402 Payment Required (plan/billing blocks the action)
 *   403 Action Forbidden (key/user lacks permission)
 *   404 Not Found
 *   422 Validation Error
 */
export class TalkrouteError extends Error {
  constructor(
    public readonly status: number,
    public readonly method: string,
    public readonly path: string,
    public readonly body: unknown,
  ) {
    super(`Talkroute ${method} ${path} failed with HTTP ${status}: ${describeBody(body)}`);
    this.name = "TalkrouteError";
  }
}

function describeBody(body: unknown): string {
  if (body && typeof body === "object" && "message" in body) {
    return String((body as { message: unknown }).message);
  }
  return typeof body === "string" ? body.slice(0, 200) : JSON.stringify(body)?.slice(0, 200) ?? "";
}

type Query = Record<string, string | number | boolean | undefined>;

export class TalkrouteClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: TalkrouteClientOptions = {}) {
    const apiKey = opts.apiKey ?? process.env.TALKROUTE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Talkroute API key missing. Set TALKROUTE_API_KEY (format: tr_live_<64 hex chars>).",
      );
    }
    this.apiKey = apiKey;
    this.baseUrl = (opts.baseUrl ?? process.env.TALKROUTE_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = opts.timeoutMs ?? 15_000;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  async request<T>(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    path: string,
    opts: { query?: Query; body?: unknown } = {},
  ): Promise<T> {
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(opts.query ?? {})) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }

    const res = await this.fetchImpl(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    const text = await res.text();
    let parsed: unknown = text;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        /* keep raw text */
      }
    }
    if (!res.ok) throw new TalkrouteError(res.status, method, path, parsed);
    return (text ? parsed : undefined) as T;
  }

  get<T>(path: string, query?: Query) {
    return this.request<T>("GET", path, { query });
  }
  post<T>(path: string, body?: unknown) {
    return this.request<T>("POST", path, { body });
  }
  del<T>(path: string, query?: Query) {
    return this.request<T>("DELETE", path, { query });
  }

  // ---- Account / access checks -------------------------------------------

  /** Cheapest authenticated call; a 200 proves the key is valid. */
  getAccount() {
    return this.get<{ data: Account }>("/v2/account");
  }
  getPlan() {
    return this.get<{ data: Plan }>("/v2/accounts/plan");
  }
  getPermittedFeatures() {
    return this.get<Paginated<PermittedFeature>>("/v2/accounts/permitted-features");
  }
  /** Talkroute numbers; text conversations are keyed off these. */
  getVirtualNumbers() {
    return this.get<Paginated<Record<string, unknown>>>("/v2/virtual-numbers");
  }

  // ---- Webhook subscriptions ---------------------------------------------

  listSubscriptions(page?: number, pageSize?: number) {
    return this.get<Paginated<Subscription>>("/v2/subscriptions", { page, pageSize });
  }
  createSubscription(type: SubscriptionType, hookUrl: string) {
    return this.post<{ data: Subscription }>("/v2/subscriptions", { type, hookUrl });
  }
  deleteSubscription(id: string) {
    return this.del<void>(`/v2/subscriptions/${encodeURIComponent(id)}`);
  }
}

// ---- Types (from the OpenAPI spec) ----------------------------------------

export interface Account {
  id: string;
  name: string;
  email: string;
  planId: number;
  trial: boolean;
  isPastDue: boolean;
  daysPastDue: number;
  outboundDialing: boolean;
  timezone: string;
  [key: string]: unknown;
}

export interface Plan {
  id: number;
  planId: string;
  planName: string;
  displayName: string;
  monthlyPrice: number;
  includedUsers: number;
  isCurrent: boolean;
}

export interface PermittedFeature {
  id: string;
  feature_id: string;
  name: string;
  display_name: string;
  description: string;
  allowed: boolean;
  included: number;
  used: number;
}

export type SubscriptionType =
  | "new_text_message"
  | "new_call_record"
  | "new_voicemail"
  | "call_completed";

export interface Subscription {
  id: string;
  type: SubscriptionType;
  hookUrl: string;
}