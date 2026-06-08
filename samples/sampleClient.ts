/**
 * SAMCO Trade API v3.2 — Sample Client
 *
 * Demonstrates the recommended v3.2 flow:
 *   1. POST /session/token  → SessionTokenApi (replaces the legacy
 *      OTP → SecretKey → AccessToken → Login chain).
 *   2. GET  /ip/whoami      → WhoamiApi
 *   3. GET  /limit          → UserLimitsApi
 *   4. GET  /quote          → QuoteApi
 *   5. GET  /holding        → HoldingsApi
 *   6. POST /order/placeOrder → OrdersApi.placeOrder
 *   7. DELETE /user/logout  → UserLogoutApi
 *
 * Run:
 *   npm install samco-bridge-node
 *   export SAMCO_API_KEY=...   SAMCO_API_SECRET=...
 *   npx ts-node samples/sampleClient.ts
 */

import {
  SessionTokenApi,
  WhoamiApi,
  UserLimitsApi,
  QuoteApi,
  HoldingsApi,
  OrdersApi,
  UserLogoutApi,
  EXCHANGE_NSE,
  TRANSACTION_TYPE_BUY,
  ORDER_TYPE_LIMIT,
  VALIDITY_DAY,
  PRODUCT_MIS,
  ApiException,
} from "samco-bridge-node";

function log(label: string, payload: unknown) {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(payload, null, 2));
}

async function step<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    const result = await fn();
    log(label, result);
    return result;
  } catch (err) {
    if (err instanceof ApiException) {
      console.error(
        `\n!!! ${label} failed: HTTP ${err.code} — ${err.message}\n` +
          `    body: ${err.responseBody}`
      );
    } else {
      console.error(`\n!!! ${label} threw:`, err);
    }
    return null;
  }
}

async function main() {
  const apiKey = process.env.SAMCO_API_KEY;
  const apiSecret = process.env.SAMCO_API_SECRET;
  if (!apiKey || !apiSecret) {
    console.error("Set SAMCO_API_KEY and SAMCO_API_SECRET in the environment.");
    process.exit(1);
  }

  // 1. Generate a session token (v3.2 one-step auth).
  const sessionApi = new SessionTokenApi();
  const session = await step("SessionTokenApi.generate", () =>
    sessionApi.generate({ apiKey, apiSecret })
  );
  const sessionToken = session?.sessionToken ?? sessionApi.getSessionToken();
  if (!sessionToken) {
    console.error("Could not obtain a session token — aborting.");
    process.exit(1);
  }

  // 2. Confirm the source IP the API sees (useful for static-IP whitelisting).
  await step("WhoamiApi.whoami", () => new WhoamiApi().whoami(sessionToken));

  // 3. Funds & margin.
  await step("UserLimitsApi.getLimits", () =>
    new UserLimitsApi().getLimits(sessionToken)
  );

  // 4. Live quote.
  await step("QuoteApi.getQuote (SBIN @ NSE)", () =>
    new QuoteApi().getQuote(sessionToken, "SBIN", EXCHANGE_NSE)
  );

  // 5. CNC holdings.
  await step("HoldingsApi.getHolding", () =>
    new HoldingsApi().getHolding(sessionToken)
  );

  // 6. Place an MIS limit order on SBIN (well below market so it stays pending).
  await step("OrdersApi.placeOrder (SBIN MIS LIMIT)", () =>
    new OrdersApi().placeOrder(sessionToken, {
      symbolName: "SBIN",
      exchange: EXCHANGE_NSE,
      transactionType: TRANSACTION_TYPE_BUY,
      orderType: ORDER_TYPE_LIMIT,
      quantity: "1",
      disclosedQuantity: "",
      price: "100",
      orderValidity: VALIDITY_DAY,
      productType: PRODUCT_MIS,
      afterMarketOrderFlag: "NO",
    })
  );

  // 7. Clean teardown.
  await step("UserLogoutApi.logout", () =>
    new UserLogoutApi().logout(sessionToken)
  );
}

main().catch((err) => {
  console.error("Unhandled error in sample client:", err);
  process.exit(1);
});
