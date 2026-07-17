interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type D1Database = Record<string, unknown>;

declare module "cloudflare:workers" {
  export const env: {
    DB?: object;
    [key: string]: unknown;
  };
}
