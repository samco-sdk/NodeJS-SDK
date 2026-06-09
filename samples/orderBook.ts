/**
 * GET /order/orderBook — OrderBook
 *
 * Source: ta-api-docs/order/order-book.md
 *
 * Returns every order placed today across all states (open, pending,
 * rejected, executed).
 *
 * Run:
 *   1. Set SAMCO_SESSION_TOKEN in samples/.env.
 *   2. npm run order-book
 */

const BASE_URL = "https://tradeapi.samco.in";

export async function orderBook(sessionToken: string) {
  const res = await fetch(`${BASE_URL}/order/orderBook`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-session-token": sessionToken,
    },
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `orderBook failed (HTTP ${res.status}): ${JSON.stringify(body)}`
    );
  }
  return body;
}

async function main() {
  const sessionToken = process.env.SAMCO_SESSION_TOKEN;
  if (!sessionToken) {
    console.error("Set SAMCO_SESSION_TOKEN in samples/.env.");
    process.exit(1);
  }

  const book = await orderBook(sessionToken);
  console.log(JSON.stringify(book, null, 2));
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
