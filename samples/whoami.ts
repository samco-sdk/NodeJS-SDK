/**
 * b. GET /ip/whoami — IP diagnostics
 *
 * Source: ta-api-docs/static-ip/whoami.md
 *
 * Read-only check: reports the source IP the Trade API server sees you from,
 * plus the registered PRIMARY / SECONDARY IPs, and whether the source matches.
 * Useful to debug `403 - The IP is not the registered static IP`. Does NOT
 * consume the SEBI weekly IP-update slot.
 *
 * Run:
 *   export SAMCO_SESSION_TOKEN=<JWT from POST /session/token>
 *   npx ts-node samples/whoami.ts
 */

const BASE_URL = "https://tradeapi.samco.in";

interface WhoamiResponse {
  status: string;
  statusMessage: string;
  srcIp: string;
  primaryIp: string | null;
  secondaryIp: string | null;
  matches: boolean;
  matchedAs: "PRIMARY" | "SECONDARY" | null;
}

export async function whoami(sessionToken: string): Promise<WhoamiResponse> {
  const res = await fetch(`${BASE_URL}/ip/whoami`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-session-token": sessionToken,
    },
  });

  const data = (await res.json()) as WhoamiResponse;
  if (!res.ok) {
    throw new Error(`whoami failed (HTTP ${res.status}): ${data.statusMessage}`);
  }
  return data;
}

async function main() {
  const sessionToken = process.env.SAMCO_SESSION_TOKEN;
  if (!sessionToken) {
    console.error("Set SAMCO_SESSION_TOKEN.");
    process.exit(1);
  }

  const r = await whoami(sessionToken);
  console.log(JSON.stringify(r, null, 2));

  if (!r.matches) {
    console.warn(
      `\n!!! Source IP ${r.srcIp} is NOT registered. ` +
        `Order endpoints will reject this host. ` +
        `Registered: PRIMARY=${r.primaryIp}, SECONDARY=${r.secondaryIp}.`
    );
    process.exit(2);
  }
  console.log(`OK — calling from registered ${r.matchedAs} IP (${r.srcIp}).`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
