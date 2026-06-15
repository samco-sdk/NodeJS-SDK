/**
 * f. Streaming Quote Data — WebSocket (via samco-bridge-node SDK)
 *
 * Source: ta-api-docs/streaming/streaming-quote-data.md
 *
 * Endpoint: wss://stream.samco.in
 * Auth    : `x-session-token` header (JWT from POST /session/token).
 *
 * v3.2.2 of samco-bridge-node ships a typed `StreamingClient` that wraps the
 * subscribe / unsubscribe envelope and dispatches `quote` ticks to onQuote
 * and `quote2` (depth) ticks to onDepth. Symbol format remains
 * `"<listingId>_<exchange>"` (e.g. `"3045_NSE"`) from ScripMaster.csv.
 *
 * Run:
 *   export SAMCO_SESSION_TOKEN=<JWT>
 *   npx ts-node samples/streamingQuote.ts
 */

import {
  StreamingClient,
  StreamingListener,
  QuoteTick,
  symbolRef,
} from "samco-bridge-node";

export async function streamQuotes(
  sessionToken: string,
  symbols: string[]
): Promise<StreamingClient> {
  const refs = symbols.map(symbolRef);

  const listener: StreamingListener = {
    onOpen: () => {
      console.log("Connected to streaming feed");
      console.log("Subscribe ->", symbols.join(", "));
    },
    onQuote: (tick: QuoteTick) => {
      console.log("Quote ::", JSON.stringify(tick.raw ?? tick));
    },
    onMessage: (text) => console.log("Raw ::", text),
    onError: (err) => console.error("WS error:", err),
    onClosed: (code, reason) =>
      console.log("Connection closed:", code, reason),
  };

  const client = new StreamingClient(listener);
  await client.connect(sessionToken);
  client.subscribeQuote(refs);
  return client;
}

// Graceful unsubscribe-then-close helper. Safe to call multiple times.
export function closeQuoteStream(
  client: StreamingClient,
  symbols: string[]
): void {
  try {
    client.unsubscribeQuote(symbols.map(symbolRef));
  } catch {
    // already disconnected
  }
  client.close();
}

async function main() {
  const sessionToken = process.env.SAMCO_SESSION_TOKEN;
  if (!sessionToken) {
    console.error("Set SAMCO_SESSION_TOKEN in samples/.env.");
    process.exit(1);
  }

  // Symbols use the `<listingId>_<exchange>` form from ScripMaster.csv.
  const symbols = ["11536_NSE"];
  const client = await streamQuotes(sessionToken, symbols);

  const shutdown = () => {
    closeQuoteStream(client, symbols);
    setTimeout(() => process.exit(0), 500);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
