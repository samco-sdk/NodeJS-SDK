/**
 * g. Streaming Market Data — WebSocket (5-level market depth)
 *
 * Source: ta-api-docs/streaming/streaming-market-data.md
 *
 * Endpoint: wss://stream.samco.in
 * Auth    : `x-session-token` header (JWT from POST /session/token).
 *
 * Same socket as the quote stream, but `streaming_type` is `"quote2"` and
 * frames carry 5 levels of bid/ask market depth instead of a single quote.
 *
 * Subscribe frame:
 *   { request: { streaming_type: "quote2",
 *                data: { symbols: [{ symbol: "3880_NSE" }, ...] },
 *                request_type: "subscribe",
 *                response_format: "json" } }
 *
 * Runtime: Node 22+ with `npm i ws`.
 *
 * Run:
 *   export SAMCO_SESSION_TOKEN=<JWT>
 *   npx ts-node samples/streamingMarketData.ts
 */

import WebSocket from "ws";

const STREAM_URL = "wss://stream.samco.in";

interface MarketDataFrame {
  request: {
    streaming_type: "quote2";
    data: { symbols: { symbol: string }[] };
    request_type: "subscribe" | "unsubscribe";
    response_format: "json";
  };
}

function buildFrame(
  symbols: string[],
  action: "subscribe" | "unsubscribe"
): MarketDataFrame {
  return {
    request: {
      streaming_type: "quote2",
      data: { symbols: symbols.map((s) => ({ symbol: s })) },
      request_type: action,
      response_format: "json",
    },
  };
}

export function streamMarketData(
  sessionToken: string,
  symbols: string[]
): WebSocket {
  const ws = new WebSocket(STREAM_URL, {
    headers: { "x-session-token": sessionToken },
  });

  ws.on("open", () => {
    console.log("Connected to", STREAM_URL);
    ws.send(JSON.stringify(buildFrame(symbols, "subscribe")));
    console.log("Subscribed to", symbols.join(", "));
  });

  ws.on("message", (msg: WebSocket.RawData) => {
    console.log("MarketData ::", msg.toString());
  });

  ws.on("error", (err: Error) => console.error("WS error:", err));
  ws.on("close", (code: number) => console.log("Connection closed:", code));
  return ws;
}

export function closeMarketDataStream(ws: WebSocket, symbols: string[]): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(buildFrame(symbols, "unsubscribe")));
    ws.close(1000, "client shutdown");
  }
}

function main() {
  const sessionToken = process.env.SAMCO_SESSION_TOKEN;
  if (!sessionToken) {
    console.error("Set SAMCO_SESSION_TOKEN in samples/.env.");
    process.exit(1);
  }

  // `<listingId>_<exchange>` from ScripMaster.csv (per the doc's sample).
  const symbols = ["1594_NSE"];
  const ws = streamMarketData(sessionToken, symbols);

  const shutdown = () => {
    closeMarketDataStream(ws, symbols);
    setTimeout(() => process.exit(0), 500);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (require.main === module) {
  main();
}
