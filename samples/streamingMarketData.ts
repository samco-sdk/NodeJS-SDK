/**
 * g. Streaming Market Data — WebSocket (5-level market depth via samco-bridge-node SDK)
 *
 * Source: ta-api-docs/streaming/streaming-market-data.md
 *
 * Endpoint: wss://stream.samco.in
 * Auth    : `x-session-token` header (JWT from POST /session/token).
 *
 * Same socket as the quote stream, but `streaming_type` is `"quote2"` and
 * frames carry 5 levels of bid/ask market depth instead of a single quote.
 *
 * v3.2.2 of samco-bridge-node exposes this via `StreamingClient.subscribeMarketDepth`,
 * dispatching frames to the `onDepth` listener callback.
 *
 * Run:
 *   export SAMCO_SESSION_TOKEN=<JWT>
 *   npx ts-node samples/streamingMarketData.ts
 */

import {
  StreamingClient,
  StreamingListener,
  DepthTick,
  symbolRef,
} from "samco-bridge-node";

export async function streamMarketData(
  sessionToken: string,
  symbols: string[]
): Promise<StreamingClient> {
  const refs = symbols.map(symbolRef);

  const listener: StreamingListener = {
    onOpen: () => {
      console.log("Connected to streaming feed");
      console.log("Subscribed to", symbols.join(", "));
    },
    onDepth: (tick: DepthTick) => {
      console.log("MarketData ::", JSON.stringify(tick.raw ?? tick));
    },
    onMessage: (text) => console.log("Raw ::", text),
    onError: (err) => console.error("WS error:", err),
    onClosed: (code) => console.log("Connection closed:", code),
  };

  const client = new StreamingClient(listener);
  await client.connect(sessionToken);
  client.subscribeMarketDepth(refs);
  return client;
}

export function closeMarketDataStream(
  client: StreamingClient,
  symbols: string[]
): void {
  try {
    client.unsubscribeMarketDepth(symbols.map(symbolRef));
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

  // `<listingId>_<exchange>` from ScripMaster.csv (per the doc's sample).
  const symbols = ["1594_NSE"];
  const client = await streamMarketData(sessionToken, symbols);

  const shutdown = () => {
    closeMarketDataStream(client, symbols);
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
