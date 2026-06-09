/**
 * End-to-end showcase. Loads samples/.env (via `ts-node -r dotenv/config`)
 * and runs every other sample's exported function in sequence — mirrors the
 * Java QuickStartSample.
 *
 * Toggles:
 *   SAMCO_RUN_PLACE_ORDER=true  -> includes placeOrder (destructive)
 *   SAMCO_RUN_STREAMING=true    -> includes streaming-quote + streaming-md
 *                                  (each runs ~60s then auto-shuts down).
 */

import WebSocket from "ws";
import { getHoldings } from "./getHoldings";
import { getOrderStatus } from "./getOrderStatus";
import { getPositions } from "./getPositions";
import { getQuote } from "./getQuote";
import { orderBook } from "./orderBook";
import { placeOrder } from "./placeOrder";
import { generateSessionToken } from "./sessionToken";
import { closeMarketDataStream, streamMarketData } from "./streamingMarketData";
import { closeQuoteStream, streamQuotes } from "./streamingQuote";
import { whoami } from "./whoami";

const STREAM_DURATION_MS = 60_000;

function flag(name: string): boolean {
  return (process.env[name] ?? "false").trim().toLowerCase() === "true";
}

function isPlaceholder(s: string): boolean {
  return s.startsWith("<") && s.endsWith(">");
}

function requireRealCredentials(): { apiKey: string; apiSecret: string } {
  const apiKey = (process.env.SAMCO_API_KEY ?? "").trim();
  const apiSecret = (process.env.SAMCO_API_SECRET ?? "").trim();
  if (!apiKey || !apiSecret || isPlaceholder(apiKey) || isPlaceholder(apiSecret)) {
    throw new Error(
      "SAMCO_API_KEY / SAMCO_API_SECRET are missing or still placeholders. " +
        "Edit samples/.env with your AES-encrypted credentials before running."
    );
  }
  return { apiKey, apiSecret };
}

function section(title: string): void {
  console.log(`\n==== ${title} ====`);
}

function skipped(title: string, reason: string): void {
  console.log(`\n---- ${title} (skipped: ${reason}) ----`);
}

async function runStep(title: string, step: () => Promise<void>): Promise<void> {
  section(title);
  try {
    await step();
  } catch (err) {
    const e = err as Error;
    console.log(`[${title}] failed: ${e.name}: ${e.message}`);
  }
}

async function runStream(
  title: string,
  open: () => WebSocket,
  close: (ws: WebSocket) => void,
  durationMs: number
): Promise<void> {
  section(title);
  console.log(`[${title}] streaming for ${durationMs / 1000}s …`);
  await new Promise<void>((resolve) => {
    let ws: WebSocket;
    try {
      ws = open();
    } catch (err) {
      const e = err as Error;
      console.log(`[${title}] failed: ${e.name}: ${e.message}`);
      resolve();
      return;
    }
    let received = 0;
    ws.on("message", () => {
      received++;
    });

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      console.log(
        `[${title}] closed - ${received} message(s) received in ${durationMs / 1000}s.`
      );
      resolve();
    };
    const timer = setTimeout(() => {
      console.log(
        `[${title}] ${durationMs / 1000}s elapsed - unsubscribing and closing.`
      );
      close(ws);
      setTimeout(finish, 1500); // safety net if server never echoes close
    }, durationMs);
    ws.on("close", finish);
    ws.on("error", finish);
  });
}

async function main(): Promise<void> {
  const { apiKey, apiSecret } = requireRealCredentials();

  let sessionToken = "";
  await runStep("1. SessionTokenSample", async () => {
    sessionToken = await generateSessionToken(apiKey, apiSecret);
    console.log("JWT acquired (first 24 chars):", sessionToken.slice(0, 24) + "…");
  });

  if (!sessionToken) {
    console.log("\nAborting QuickStart: session token unavailable.");
    process.exit(1);
  }

  // Make the JWT available to any sample that still reads it from env.
  process.env.SAMCO_SESSION_TOKEN = sessionToken;

  await runStep("2. WhoAmISample", async () => {
    const r = await whoami(sessionToken);
    console.log(JSON.stringify(r, null, 2));
  });

  await runStep("3. QuoteSample", async () => {
    const q = await getQuote(sessionToken, "SBIN", "NSE");
    console.log(JSON.stringify(q, null, 2));
  });

  await runStep("4. PositionsSample (NET)", async () => {
    const p = await getPositions(sessionToken, "NET");
    console.log(JSON.stringify(p, null, 2));
  });

  await runStep("5. HoldingsSample", async () => {
    const h = await getHoldings(sessionToken);
    console.log(JSON.stringify(h, null, 2));
  });

  await runStep("6. OrderBookSample", async () => {
    const b = await orderBook(sessionToken);
    console.log(JSON.stringify(b, null, 2));
  });

  const orderNumber = process.env.SAMCO_ORDER_NUMBER?.trim();
  if (orderNumber) {
    await runStep("7. OrderStatusSample", async () => {
      const s = await getOrderStatus(sessionToken, orderNumber);
      console.log(JSON.stringify(s, null, 2));
    });
  } else {
    skipped("OrderStatusSample", "SAMCO_ORDER_NUMBER not set in .env");
  }

  if (flag("SAMCO_RUN_PLACE_ORDER")) {
    await runStep("8. PlaceOrderSample", async () => {
      const r = await placeOrder(sessionToken, {
        symbolName: "IDEA",
        exchange: "NSE",
        transactionType: "BUY",
        orderType: "L",
        quantity: "1",
        disclosedQuantity: "1",
        price: "13.40",
        orderValidity: "DAY",
        productType: "CNC",
        afterMarketOrderFlag: "NO",
      });
      console.log(JSON.stringify(r, null, 2));
    });
  } else {
    skipped(
      "PlaceOrderSample",
      "SAMCO_RUN_PLACE_ORDER=false (destructive — set to true to enable)"
    );
  }

  if (flag("SAMCO_RUN_STREAMING")) {
    const quoteSymbols = ["11536_NSE"];
    await runStream(
      "9. StreamingQuoteSample",
      () => streamQuotes(sessionToken, quoteSymbols),
      (ws) => closeQuoteStream(ws, quoteSymbols),
      STREAM_DURATION_MS
    );
    const mdSymbols = ["1594_NSE"];
    await runStream(
      "10. StreamingMarketDataSample",
      () => streamMarketData(sessionToken, mdSymbols),
      (ws) => closeMarketDataStream(ws, mdSymbols),
      STREAM_DURATION_MS
    );
  } else {
    skipped("Streaming samples", "SAMCO_RUN_STREAMING=false");
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
