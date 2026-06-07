/**
 * f. Streaming Quote Data — WebSocket
 *
 * Source: ta-api-docs/streaming/streaming-quote-data.md
 *
 * Endpoint: wss://stream.samco.in
 * Auth    : `x-session-token` header (JWT from POST /session/token).
 *
 * Subscribe frame shape:
 *   { request: { streaming_type: "quote",
 *                data: { symbols: [{ symbol: "<listingId>_<exch>" }] },
 *                request_type: "subscribe",
 *                response_format: "json" } }
 *
 * The same frame with `request_type: "unsubscribe"` stops a stream — always
 * unsubscribe before closing in production code.
 *
 * Runtime: Node 22+ with the `ws` package — `npm i ws`.
 *
 * Run:
 *   export SAMCO_SESSION_TOKEN=<JWT>
 *   npx ts-node samples/streamingQuote.ts
 */

import WebSocket from "ws";

const STREAM_URL = "wss://stream.samco.in";

interface SubscribeFrame {
  request: {
    streaming_type: "quote";
    data: { symbols: { symbol: string }[] };
    request_type: "subscribe" | "unsubscribe";
    response_format: "json";
  };
}

function buildFrame(
  symbols: string[],
  action: "subscribe" | "unsubscribe"
): SubscribeFrame {
  return {
    request: {
      streaming_type: "quote",
      data: { symbols: symbols.map((s) => ({ symbol: s })) },
      request_type: action,
      response_format: "json",
    },
  };
}

function streamQuotes(sessionToken: string, symbols: string[]) {
  const ws = new WebSocket(STREAM_URL, {
    headers: { "x-session-token": sessionToken },
  });

  ws.on("open", () => {
    console.log("Connected to", STREAM_URL);
    ws.send(JSON.stringify(buildFrame(symbols, "subscribe")));
  });

  ws.on("message", (msg: WebSocket.RawData) => {
    console.log("Quote ::", msg.toString());
  });

  ws.on("error", (err: Error) => console.error("WS error:", err));
  ws.on("close", (code: number) => console.log("Connection closed:", code));

  // Graceful shutdown: unsubscribe before closing.
  const shutdown = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(buildFrame(symbols, "unsubscribe")));
      ws.close(1000, "client shutdown");
    }
    setTimeout(() => process.exit(0), 500);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

function main() {
  const sessionToken = process.env.SAMCO_SESSION_TOKEN;
  if (!sessionToken) {
    console.error("Set SAMCO_SESSION_TOKEN.");
    process.exit(1);
  }

  // Symbols use the `<listingId>_<exchange>` form from ScripMaster.csv.
  const symbols = ["532826_BSE"];
  streamQuotes(sessionToken, symbols);
}

if (require.main === module) {
  main();
}
