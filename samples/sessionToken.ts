/**
 * a. POST /session/token — Generate Session Token (Direct)
 *
 * Source: ta-api-docs/session/generate-token.md
 *
 * Uses AES-encrypted apiKey + apiSecret to obtain a JWT session token
 * (valid until 08:00 IST next day). The returned `sessionToken` is then
 * reused as the `x-session-token` header on every subsequent Trade API call.
 *
 * Run:
 *   export SAMCO_API_KEY=<AES_ENCRYPTED_API_KEY>
 *   export SAMCO_API_SECRET=<AES_ENCRYPTED_API_SECRET>
 *   npx ts-node samples/sessionToken.ts
 */

const BASE_URL = "https://tradeapi.samco.in";

interface SessionTokenResponse {
  status: string;
  statusMessage: string;
  sessionToken?: string;
  accountID?: string;
  srcIp?: string;
  primaryIp?: string;
  secondaryIp?: string;
}

export async function generateSessionToken(
  apiKey: string,
  apiSecret: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/session/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ apiKey, apiSecret }),
  });

  const data = (await res.json()) as SessionTokenResponse;
  if (!res.ok || data.status !== "Success" || !data.sessionToken) {
    throw new Error(
      `Session token request failed (HTTP ${res.status}): ${data.statusMessage}`
    );
  }

  console.log("Account :", data.accountID);
  console.log("srcIp   :", data.srcIp, "(primary:", data.primaryIp + ")");
  return data.sessionToken;
}

// Reuse the JWT as x-session-token on any later call.
async function callWithSession(sessionToken: string, path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-session-token": sessionToken,
    },
  });
  return res.json();
}

async function main() {
  const apiKey = process.env.SAMCO_API_KEY;
  const apiSecret = process.env.SAMCO_API_SECRET;
  if (!apiKey || !apiSecret) {
    console.error("Set SAMCO_API_KEY and SAMCO_API_SECRET (AES-encrypted).");
    process.exit(1);
  }

  const sessionToken = await generateSessionToken(apiKey, apiSecret);
  console.log("JWT acquired (first 24 chars):", sessionToken.slice(0, 24) + "…");

  // Reuse the JWT for any v3.2 endpoint.
  const limits = await callWithSession(sessionToken, "/limit/getLimits");
  console.log("Limits :", JSON.stringify(limits, null, 2));
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
