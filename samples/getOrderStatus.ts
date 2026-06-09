/**
 * GET /order/getOrderStatus — OrderStatus
 *
 * Source: ta-api-docs/order/get-order-status.md
 *
 * Returns the current status of a single order by its `orderNumber`.
 *
 * Run:
 *   1. Set SAMCO_SESSION_TOKEN in samples/.env.
 *   2. npm run order-status -- 240207000133590
 *      (or set SAMCO_ORDER_NUMBER in .env)
 */

const BASE_URL = "https://tradeapi.samco.in";

export async function getOrderStatus(sessionToken: string, orderNumber: string) {
  const url = new URL(`${BASE_URL}/order/getOrderStatus`);
  url.searchParams.set("orderNumber", orderNumber);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-session-token": sessionToken,
    },
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `getOrderStatus failed (HTTP ${res.status}): ${JSON.stringify(body)}`
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

  const orderNumber = process.argv[2] ?? process.env.SAMCO_ORDER_NUMBER;
  if (!orderNumber) {
    console.error(
      "Provide orderNumber as a CLI arg or set SAMCO_ORDER_NUMBER in samples/.env."
    );
    process.exit(1);
  }

  const status = await getOrderStatus(sessionToken, orderNumber);
  console.log(JSON.stringify(status, null, 2));
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
