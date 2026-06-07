/**
 * c. OAuth 2.1 Authorization-Code Flow — backend code exchange
 *
 * Source: ta-api-docs/oauth/authorize-flow.md
 *
 * The browser redirect (steps 1-3) is out of band — the user authorises on
 * SAMCO's hosted consent page and lands on your registered redirect_url with
 * `?code=...&state=...`. This sample covers Step 4: your backend exchanges
 * that short-lived (10-minute) `code` at POST /oauth/token for an
 * `access_token`, which you then use as the `x-session-token` header.
 *
 * Run (after capturing the code from your callback):
 *   export SAMCO_OAUTH_CODE=<code-from-callback>
 *   npx ts-node samples/oauthExchange.ts
 */

const BASE_URL = "https://tradeapi.samco.in";

interface OAuthTokenResponse {
  status: string;
  message?: string;
  data?: {
    access_token: string;
    token_type: "Bearer";
    expires_in: number; // seconds, typically 86400 (24h)
    refresh_token: string;
    refresh_token_expires_in: number; // seconds, typically 604800 (7d)
    session_id: string;
    accountID: string;
    accountName: string;
    exchangeList: string[];
    orderTypeList: string[];
    productList: string[];
    srcIp: string;
    primaryIp: string;
    secondaryIp: string;
  };
}

export async function exchangeAuthCode(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}> {
  // Note: per the spec, the code itself is the credential — do NOT send
  // api_key / api_secret here.
  const res = await fetch(`${BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "authorization_code", code }),
  });

  const body = (await res.json()) as OAuthTokenResponse;
  if (!res.ok || body.status !== "Success" || !body.data) {
    throw new Error(
      `Token exchange failed (HTTP ${res.status}): ${body.message}`
    );
  }

  console.log("Account     :", body.data.accountName, `(${body.data.accountID})`);
  console.log("access_token expires in", body.data.expires_in, "s");
  console.log(
    "refresh_token expires in",
    body.data.refresh_token_expires_in,
    "s"
  );

  return {
    accessToken: body.data.access_token,
    refreshToken: body.data.refresh_token,
    sessionId: body.data.session_id,
  };
}

// Use the access_token as the x-session-token header on Trade API calls.
async function callHolding(accessToken: string) {
  const res = await fetch(`${BASE_URL}/holding/getHolding`, {
    method: "GET",
    headers: { Accept: "application/json", "x-session-token": accessToken },
  });
  return res.json();
}

// Refresh-token grant (call when access_token is near expiry).
export async function refresh(refreshToken: string) {
  const res = await fetch(`${BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  return res.json();
}

async function main() {
  const code = process.env.SAMCO_OAUTH_CODE;
  if (!code) {
    console.error(
      "Set SAMCO_OAUTH_CODE to the `code` value from your OAuth callback."
    );
    process.exit(1);
  }

  const { accessToken, refreshToken } = await exchangeAuthCode(code);
  console.log("access_token (first 24):", accessToken.slice(0, 24) + "…");
  console.log("refresh_token (first 12):", refreshToken.slice(0, 12) + "…");

  // Demonstrate using the access token.
  console.log("\nHoldings:", JSON.stringify(await callHolding(accessToken), null, 2));
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
