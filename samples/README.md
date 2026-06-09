# SAMCO Trade API v3.2 — Node.js samples

Runnable TypeScript samples for the v3.2 endpoints documented in
[`ta-api-docs`](https://docs-tradeapi.samco.in). Most samples are plain
`fetch` / `ws` (no SDK dependency) so they read 1:1 against the docs;
`sampleClient.ts` is the same flow expressed through `samco-bridge-node`.

## Install

```bash
cd samples
npm install
# then edit samples/.env with your AES-encrypted credentials
```

Requires **Node 22+** (streaming endpoints need a modern WebSocket client).

## Environment variables

Set these in `.env` (auto-loaded by every `npm run <script>` via
`ts-node -r dotenv/config`) or export them in your shell.

| Var                    | Used by                                          |
|------------------------|--------------------------------------------------|
| `SAMCO_API_KEY`         | `session-token`, `sample-client`, `quick-start`  |
| `SAMCO_API_SECRET`      | `session-token`, `sample-client`, `quick-start`  |
| `SAMCO_SESSION_TOKEN`   | `whoami`, `get-quote`, `place-order`, `stream-quote`, `stream-market-data` |
| `SAMCO_RUN_PLACE_ORDER` | `quick-start` — `true` includes the destructive place-order step |
| `SAMCO_RUN_STREAMING`   | `quick-start` — `true` runs each streaming sample ~60 s then exits |

Both `SAMCO_API_KEY` and `SAMCO_API_SECRET` must be the **AES-encrypted**
values delivered when the OAuth app was created.

## Scripts

| Script                          | Endpoint                                   | Source doc                                  |
|---------------------------------|--------------------------------------------|---------------------------------------------|
| `npm run session-token`         | `POST /session/token`                      | `session/generate-token.md`                 |
| `npm run whoami`                | `GET /ip/whoami`                           | `static-ip/whoami.md`                       |
| `npm run get-quote`             | `GET /quote/getQuote`                      | `quote/get-quote.md`                        |
| `npm run place-order`           | `POST /order/placeOrder` (LIMIT)           | `order/place-order.md`                      |
| `npm run get-positions`         | `GET /position/getPositions`               | `position/get-positions.md`                 |
| `npm run get-holdings`          | `GET /holding/getHoldings`                 | `holding/get-holdings.md`                   |
| `npm run order-book`            | `GET /order/orderBook`                     | `order/order-book.md`                       |
| `npm run order-status`          | `GET /order/getOrderStatus`                | `order/get-order-status.md`                 |
| `npm run stream-quote`          | `wss://stream.samco.in` (`quote`)          | `streaming/streaming-quote-data.md`         |
| `npm run stream-market-data`    | `wss://stream.samco.in` (`quote2`, depth)  | `streaming/streaming-market-data.md`        |
| `npm run sample-client`         | End-to-end flow via `samco-bridge-node`    | (SDK walkthrough)                           |
| `npm run quick-start`           | Runs every sample above in sequence        | (mirrors Java `QuickStartSample`)           |

## Quick start

```bash
# Edit samples/.env: set SAMCO_API_KEY / SAMCO_API_SECRET, then:
npm run quick-start        # session-token → whoami → quote → (opt) place-order → (opt) streaming
```

`quick-start` reads `SAMCO_RUN_PLACE_ORDER` and `SAMCO_RUN_STREAMING` from
`.env` to opt in/out of the destructive and long-running steps.

## Running samples individually

```bash
# 1. Get a session token (prints the JWT).
npm run session-token

# 2. Paste the JWT into SAMCO_SESSION_TOKEN in .env, then:
npm run whoami
npm run get-quote          # defaults to SBIN @ NSE
npm run place-order        # LIMIT order — review the body in placeOrder.ts first
npm run stream-quote       # Ctrl-C to unsubscribe + close
```

> ⚠️  These hit live trading endpoints. SAMCO does not provide a sandbox —
> `npm run place-order` registers a real order against your account.
