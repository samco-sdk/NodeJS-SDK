/**
 * e. POST /order/placeOrder — Place Order (LIMIT variant)
 *
 * Source: ta-api-docs/order/place-order.md
 *
 * LIMIT order: `orderType=L` requires a `price`. CNC/MIS/NRML are valid
 * product types. Sent with `x-session-token` (JWT from POST /session/token).
 *
 * !!! Live trading endpoint — there is no SAMCO sandbox. A successful call
 * !!! places a real order against the authenticated trading account.
 *
 * Run:
 *   export SAMCO_SESSION_TOKEN=<JWT>
 *   npx ts-node samples/placeOrder.ts
 */

const BASE_URL = "https://tradeapi.samco.in";

interface PlaceOrderRequest {
  symbolName: string;
  exchange: "NSE" | "BSE" | "NFO" | "BFO" | "MCX" | "CDS";
  transactionType: "BUY" | "SELL";
  orderType: "L" | "SL"; // place-order.md only documents L and SL here
  quantity: string;
  disclosedQuantity?: string;
  price: string; // mandatory for L / SL
  triggerPrice?: string; // mandatory for SL
  orderValidity: "DAY" | "IOC";
  productType: "CNC" | "MIS" | "NRML";
  afterMarketOrderFlag?: "YES" | "NO";
}

export async function placeOrder(
  sessionToken: string,
  req: PlaceOrderRequest
) {
  const res = await fetch(`${BASE_URL}/order/placeOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-session-token": sessionToken,
    },
    body: JSON.stringify(req),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `placeOrder failed (HTTP ${res.status}): ${JSON.stringify(body)}`
    );
  }
  return body;
}

async function main() {
  const sessionToken = process.env.SAMCO_SESSION_TOKEN;
  if (!sessionToken) {
    console.error("Set SAMCO_SESSION_TOKEN.");
    process.exit(1);
  }

  // LIMIT order modeled on the doc's `[LIMIT ORDER]` sample.
  const response = await placeOrder(sessionToken, {
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

  console.log(JSON.stringify(response, null, 2));
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
