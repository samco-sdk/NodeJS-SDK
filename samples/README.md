# SAMCO Trade API v3.2 — Node.js samples

Runnable TypeScript samples for the v3.2 endpoints documented in
[`ta-api-docs`](https://docs-tradeapi.samco.in). Most samples are plain
`fetch` / `ws` (no SDK dependency) so they read 1:1 against the docs;
`sampleClient.ts` is the same flow expressed through `samco-bridge-node`.

## Install

```bash
cd samples
npm install
```

Requires **Node 22+** (streaming endpoints need a modern WebSocket client).

## Environment variables

| Var                    | Used by                                          |
|------------------------|--------------------------------------------------|
| `SAMCO_API_KEY`        | `session-token`, `sample-client`                 |
| `SAMCO_API_SECRET`     | `session-token`, `sample-client`                 |
| `SAMCO_SESSION_TOKEN`  | `whoami`, `get-quote`, `place-order`, `stream-quote`, `stream-market-data` |
| `SAMCO_OAUTH_CODE`     | `oauth-exchange`                                 |

Both `SAMCO_API_KEY` and `SAMCO_API_SECRET` must be the **AES-encrypted**
values delivered when the OAuth app was created.

## Scripts

| Script                          | Endpoint                                   | Source doc                                  |
|---------------------------------|--------------------------------------------|---------------------------------------------|
| `npm run session-token`         | `POST /session/token`                      | `session/generate-token.md`                 |
| `npm run whoami`                | `GET /ip/whoami`                           | `static-ip/whoami.md`                       |
| `npm run oauth-exchange`        | `POST /oauth/token` (code → access_token)  | `oauth/authorize-flow.md`                   |
| `npm run get-quote`             | `GET /quote/getQuote`                      | `quote/get-quote.md`                        |
| `npm run place-order`           | `POST /order/placeOrder` (LIMIT)           | `order/place-order.md`                      |
| `npm run stream-quote`          | `wss://stream.samco.in` (`quote`)          | `streaming/streaming-quote-data.md`         |
| `npm run stream-market-data`    | `wss://stream.samco.in` (`quote2`, depth)  | `streaming/streaming-market-data.md`        |
| `npm run sample-client`         | End-to-end flow via `samco-bridge-node`    | (SDK walkthrough)                           |

## Typical flow

```bash
# 1. Get a session token (prints the JWT).
SAMCO_API_KEY=... SAMCO_API_SECRET=... npm run session-token

# 2. Reuse that JWT for every subsequent call.
export SAMCO_SESSION_TOKEN=<JWT>
npm run whoami
npm run get-quote          # defaults to SBIN @ NSE
npm run place-order        # LIMIT order — review the body in placeOrder.ts first
npm run stream-quote       # Ctrl-C to unsubscribe + close
```

> ⚠️  These hit live trading endpoints. SAMCO does not provide a sandbox —
> `npm run place-order` registers a real order against your account.
