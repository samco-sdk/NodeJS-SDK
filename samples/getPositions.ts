/**
 * GET /position/getPositions — Positions
 *
 * Source: ta-api-docs/position/get-positions.md
 *
 * Returns the user's positions for the day or net. `positionType` defaults
 * to `DAY`; pass `NET` for carry-forward + intraday combined.
 *
 * Run:
 *   1. Set SAMCO_SESSION_TOKEN in samples/.env.
 *   2. npm run get-positions            # DAY
 *      npm run get-positions -- NET     # NET
 */

const BASE_URL = "https://tradeapi.samco.in";

export async function getPositions(
  sessionToken: string,
  positionType: "DAY" | "NET" = "DAY"
) {
  const url = new URL(`${BASE_URL}/position/getPositions`);
  url.searchParams.set("positionType", positionType);

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
      `getPositions failed (HTTP ${res.status}): ${JSON.stringify(body)}`
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

  const positionType = (process.argv[2] as "DAY" | "NET") ?? "DAY";
  const positions = await getPositions(sessionToken, positionType);
  console.log(JSON.stringify(positions, null, 2));
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
