/**
 * d. GET /quote/getQuote — Get Quote
 *
 * Source: ta-api-docs/quote/get-quote.md
 *
 * Returns market depth (LTP, OHLC, bids/asks, circuit limits, etc.) for a
 * single scrip. Called with the JWT obtained from POST /session/token
 * (samples/sessionToken.ts) sent as `x-session-token`.
 *
 * Run:
 *   export SAMCO_SESSION_TOKEN=<JWT>
 *   npx ts-node samples/getQuote.ts SBIN NSE
 */

const BASE_URL = "https://tradeapi.samco.in";

export async function getQuote(
  sessionToken: string,
  symbolName: string,
  exchange = "NSE"
) {
  const url = new URL(`${BASE_URL}/quote/getQuote`);
  url.searchParams.set("symbolName", symbolName);
  url.searchParams.set("exchange", exchange);

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
      `getQuote failed (HTTP ${res.status}): ${JSON.stringify(body)}`
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

  const [, , symbolName = "SBIN", exchange = "NSE"] = process.argv;
  const quote = await getQuote(sessionToken, symbolName, exchange);
  console.log(JSON.stringify(quote, null, 2));
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
