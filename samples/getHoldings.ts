/**
 * GET /holding/getHoldings — Holdings
 *
 * Source: ta-api-docs/holding/get-holdings.md
 *
 * Returns the user's long-term equity holdings (demat) along with current
 * market value and P&L versus average buy price.
 *
 * Run:
 *   1. Set SAMCO_SESSION_TOKEN in samples/.env.
 *   2. npm run get-holdings
 */

const BASE_URL = "https://tradeapi.samco.in";

export async function getHoldings(sessionToken: string) {
  const res = await fetch(`${BASE_URL}/holding/getHoldings`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-session-token": sessionToken,
    },
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `getHoldings failed (HTTP ${res.status}): ${JSON.stringify(body)}`
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

  const holdings = await getHoldings(sessionToken);
  console.log(JSON.stringify(holdings, null, 2));
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
