# SamcoBridge - Node.js Bridge for SAMCO Trade API

   Official Node.js Bridge for accessing Stocknote API
   
   This documentation covers details of the Node.js bridge / SDK provided by SAMCO, for accessing the <a href="https://docs-tradeapi.samco.in/#samco-api-documentation">SAMCO Trade API v3.2.0</a>

## What's new in v3.2

The SDK now ships every endpoint added in [Trade API v3.2.0](https://docs-tradeapi.samco.in/release-notes/v3.2.0):

- **`SessionTokenApi`** — direct authentication via `POST /session/token` (apiKey + apiSecret). Recommended over the legacy 4-step login.
- **`OAuthApi`** — OAuth 2.1 Authorization-Code flow: `buildAuthorizeUrl()`, `waitForCallback()` (built-in localhost listener), `exchangeToken()`, `revoke()`.
- **`WhoamiApi`** — `GET /ip/whoami` to confirm the source IP your client is reaching the Trade API with.

The legacy `UserLoginApi`, `GenerateOtpApi`, `SecretKeyGenerateApi`, `AccessTokenApi`, `IpRegisterApi`, and `IpUpdateApi` classes continue to work but are marked `@deprecated`. New integrations should adopt `SessionTokenApi` (or `OAuthApi`) and `RegisterStaticIpApi`.

### Quick start (v3.2)

```ts
import { SessionTokenApi, WhoamiApi, BasketApi } from "samco-bridge-node";

const auth = new SessionTokenApi();
const { sessionToken } = await auth.generate({
  apiKey: process.env.SAMCO_API_KEY!,
  apiSecret: process.env.SAMCO_API_SECRET!,
});

const whoami = await new WhoamiApi().whoami(sessionToken!);
console.log("Source IP:", whoami.srcIp);

const basket = new BasketApi();
const created = await basket.createBasket(sessionToken!, { basketName: "MyBasket" });
```


## Overview

   * Node.js SDK is created for users to easily access our Stocknote API platform from Node.js/TypeScript based applications.
   
   * Node.js SDK will be exposed as a downloadable npm package
   
   * Install the npm package in your project and access the trade APIs using the inbuilt classes in Node.js SDK
   
   * Different classes and methods are exposed in the SDK for handling different Trade API
   
   * As an initial step, users need to use the Login method for connecting to APIs and in the response object you will get user session identifier. Using the session identifier, users can access other API's
    
   * With Trade API being a REST based interface and it uses JSON request and response messages, Node.js SDK provides request and response interfaces as native TypeScript types

   * For specific details on parameters passed on the request, and details about API response, please refer our [Trade API documentation](https://docs-tradeapi.samco.in/#samco-api-documentation).  
 
### Note

   * All API response displayed in this documentation are JSON representation of response objects 
   
### Prerequisites 

* Node.js 18 and above
* TypeScript 5.0+ (optional, for TypeScript users)


### Prerequisites (One-Time Setup)

Starting with **v3.2.0**, the recommended way to authenticate is the **Session Token (Direct)** flow using an OAuth app's `apiKey` and `apiSecret`. The older OTP + Secret-Key + Access-Token + Password-Login flow is still supported (see <a href="#login">Login</a>), but new integrations should prefer the steps below.

1. **Create an OAuth app**  
   Log in to the [Web Dashboard](https://docs-tradeapi.samco.in/dashboard/user-manual) and create an app. The dashboard returns an `apiKey` and `apiSecret` pair (you can have up to 5 active pairs per account).

2. **Register a Static IP**  
   Register a primary (and optional secondary) static IP for the app via the Dashboard. Order-related APIs reject traffic from non-whitelisted IPs. You can also use the legacy <a href="#ipregistration">IpRegister</a> / <a href="#ipupdate">IpUpdate</a> APIs.

3. **(Optional) Confirm your source IP**  
   Call the new <a href="#whoami">WhoAmI</a> API to confirm the IP our servers see you from — useful for debugging `403 — The IP is not the registered static IP` errors. This endpoint does **not** consume your SEBI weekly IP-update slot.


### Authentication

4. **Generate Session Token (recommended, v3.2.0+)**  
   Call the [Generate Session Token](#sessiontoken) API using:

   - `apiKey`    — API key from the Dashboard
   - `apiSecret` — API secret from the Dashboard

   The response carries a `sessionToken` which is sent as the `x-session-token` header on every subsequent Trade API call. This single call replaces the legacy 4-step OTP/Secret-Key/Access-Token/Login flow.

   For browser-based, end-user delegated sign-in instead of a backend integration, use the [OAuth 2.1 Authorization-Code Flow](https://docs-tradeapi.samco.in/oauth/authorize-flow) (documented in the Trade API docs; not wrapped as a separate SDK section).

5. **Legacy: Generate Access Token + Login**  
   If you are still on password-based auth, call the [Generate Access Token](#generateaccesstoken) API with `uid` + `secretApiKey`, then call <a href="#login">UserLogin</a> with `userId`, `password`, `yob`, and `accessToken`. Notes on the access token:
   - The **Secret API Key does not expire** and can be reused.
   - The access token is valid for one day and expires before **8:00 AM** the next day.
   
   
### Steps

1. Install the npm package

```bash
npm install samco-bridge-node
```

2. Import and use in your project

```typescript
import { UserLoginApi, QuoteApi, EXCHANGE_NSE } from "samco-bridge-node";
```

Or using require:

```javascript
const { UserLoginApi, QuoteApi, EXCHANGE_NSE } = require("samco-bridge-node");
```

3. To change the base URL (default is `https://tradeapi.samco.in`):

```typescript
import { setBaseUrl } from "samco-bridge-node";
setBaseUrl("https://tradeapi.samco.in");
```
			   
			   
###  List of supported API

 *  <a href="#sessiontoken">GenerateSessionToken</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#whoami">WhoAmI</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#login">Login</a> *(legacy)*
 *  <a href="#generateotp">GenerateOtp</a> *(legacy)*
 *  <a href="#generatesecretapikey">GenerateSecretAPIKey</a> *(legacy)*
 *  <a href="#generateaccesstoken">GenerateAccessToken</a> *(legacy)*
 *  <a href="#ipregistration">IpRegistration</a>
 *  <a href="#ipupdate">IPUpdate</a>
 *  <a href="#personalindex">PersonalIndex</a>
 *  <a href="#equity_search">SearchEquityDerivative</a>
 *  <a href="#quote">Quote</a>
 *  <a href="#indexquote">IndexQuote</a>
 *  <a href="#multiquote">MultiQuote</a>
 *  <a href="#spanmargin">SpanMargin</a>
 *  <a href="#optionchain">OptionChain</a>
 *  <a href="#futurechain">FutureChain</a>   
 *  <a href="#limit">UserLimits</a>
 *  <a href="#placeorder">PlaceOrder</a>
 *  <a href="#placeorderBO">PlaceOrderBO</a>
 *  <a href="#placeorderCO">PlaceOrderCO</a>
 *  <a href="#bulkorder">BulkOrder</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#modify_order">ModifyOrder</a>
 *  <a href="#orderbook">OrderBook</a>
 *  <a href="#triggerorder">TriggerOrders</a>
 *  <a href="#order_status">OrderStatus</a>
 *  <a href="#cancel_order">CancelOrder</a>
 *  <a href="#cancelorderCO">CancelOrderCO</a>
 *  <a href="#cancelorderBO">CancelOrderBO</a>
 *  <a href="#addGtt">AddGTT</a>
 *  <a href="#modifyGtt">ModifyGTT</a>
 *  <a href="#deleteGtt">DeleteGTT</a>
 *  <a href="#addOco">AddOco</a>
 *  <a href="#modifyOco">ModifyOco</a>
 *  <a href="#deleteOco">DeleteOco</a>
 *  <a href="#listGttOco">ListGttOco</a>
 *  <a href="#tradebook">TradeBook</a>
 *  <a href="#positions">Positions</a>
 *  <a href="#positionConversion">PositionConversion</a>
 *  <a href="#positionSquareOff">PositionSquareOff</a>
 *  <a href="#holdings">Holdings</a>
 *  <a href="#intraDayCandleData">IntraDayCandleData</a>
 *  <a href="#indexIntraDayCandleData">IndexIntraDayCandleData</a>
 *  <a href="#historicalCandleData">HistoricalCandleData</a>
 *  <a href="#indexHistoricalCandleData">IndexHistoricalCandleData</a>
 *  <a href="#listBasket">ListBasket</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#createBasket">CreateBasket</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#modifyBasket">ModifyBasket</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#deleteBasket">DeleteBasket</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#listBasketOrder">ListBasketOrder</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#createBasketOrder">CreateBasketOrder</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#modifyBasketOrder">ModifyBasketOrder</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#deleteBasketOrder">DeleteBasketOrder</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#executeBasket">ExecuteBasketOrder</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#basketSquareOff">BasketSquareOff</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#rearrangeBasket">RearrangeBasketOrder</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#basketSpanCalculator">BasketSpanCalculator</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#analyticsSummary">AnalyticsSummary</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#analyticsDetails">AnalyticsDetails</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#gainLoss">GainLoss</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#contractAnalyser">ContractAnalyser</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#streaming">Streaming (WebSocket)</a> &nbsp;<sup>NEW in 3.2.0</sup>
 *  <a href="#logout">Logout</a>


### <h3 id="sessiontoken">GenerateSessionToken (v3.2.0):</h3>

The recommended way to obtain a session token from v3.2.0 onwards. Exchanges your OAuth app's `apiKey` + `apiSecret` (created in the [Web Dashboard](https://docs-tradeapi.samco.in/dashboard/user-manual)) for a `sessionToken`. The returned token is sent as the `x-session-token` header on every subsequent Trade API call.

This single call replaces the legacy 4-step OTP → SecretKey → AccessToken → Login flow.

#### Parameters:

    apiKey, apiSecret

#### Sample Generate Session Token Request:
```typescript
import { SessionTokenApi } from "samco-bridge-node";

const sessionApi = new SessionTokenApi();
const session = await sessionApi.generate({
  apiKey: "<YOUR_API_KEY>",
  apiSecret: "<YOUR_API_SECRET>",
});
const sessionToken = session.sessionToken;
```

#### Sample Generate Session Token Response:
```json
{
    "serverTime": "29/01/26 10:46:06",
    "msgId": "d5f083f3-1b04-4b97-9385-1e578fdfeb7a",
    "status": "Success",
    "statusMessage": "Session token generated successfully",
    "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenId": "550e8400-e29b-41d4-a716-446655440000",
    "accountID": "DV99999",
    "accountName": "JOHN DOE",
    "exchangeList": ["NSE", "BSE", "NFO", "MCX"],
    "orderTypeList": ["L", "MKT", "SL", "SL-M"],
    "productList": ["MIS", "CNC", "NRML"],
    "srcIp": "203.0.113.10",
    "primaryIp": "203.0.113.10",
    "secondaryIp": "203.0.113.11"
}
```


### <h3 id="whoami">WhoAmI (v3.2.0):</h3>

A read-only diagnostic that reports the **source IP our server sees you calling from**, plus your currently-registered `PRIMARY` / `SECONDARY` IPs, and whether the source IP matches one of them.

Use it to debug `403 — The IP is not the registered static IP` errors — call it from the *same host* that was rejected to see the exact IP the server received. This endpoint does **not** consume the SEBI weekly IP-update slot.

#### Parameters:

    sessionToken

#### Sample WhoAmI Request:
```typescript
import { WhoamiApi } from "samco-bridge-node";

const whoamiApi = new WhoamiApi();
const whoami = await whoamiApi.whoami(sessionToken);
```

#### Sample WhoAmI Response:
```json
{
    "serverTime": "03/06/26 10:46:06",
    "msgId": "d5f083f3-1b04-4b97-9385-1e578fdfeb7a",
    "status": "Success",
    "statusMessage": "Calling from registered PRIMARY IP (203.0.113.10).",
    "srcIp": "203.0.113.10",
    "primaryIp": "203.0.113.10",
    "secondaryIp": "203.0.113.11",
    "matches": true,
    "matchedAs": "PRIMARY"
}
```


### <h3 id="login">Login Api:</h3>

   Node.js Bridge allows user authentication using UserLoginApi. A valid SAMCO Trading Account and subscription to Trade API Services is a pre-requisite for successful authentication. *(Legacy flow — new integrations should prefer <a href="#sessiontoken">GenerateSessionToken</a>.)*

#### Parameters:

    userId, password, yob, accessToken
    
#### Login Sample Request:

```typescript
const userLoginApi = new UserLoginApi();
const loginResponse = await userLoginApi.login({
  userId: "YOUR_USER_ID",
  password: "YOUR_PASSWORD",
  yob: "YOUR_YOB",
  accessToken: "YOUR_ACCESS_TOKEN",
});
const xSessionToken = userLoginApi.getSessionToken()!;
```
 
#### Sample Login Response:

```json
{
    "serverTime": "26/05/20 13:50:32",
    "msgId": "c662bbd1-0b24-4e86-a3d9-8c89d7529f2c",
    "sessionToken": "e0875f4aa3660b72ec636b0553acc7a9",
    "accountID": "client_id",
    "accountName": "client_name",
    "exchangeList": [
        "BSE",
        "MCX",
        "CDS",
        "NSE"
    ],
    "orderTypeList": [
        "L",
        "SL"
    ],
    "productList": [
        "CNC",
        "CO",
        "MIS"
    ]
}
```
    
#### Using the session token users can call other API's through Node.js SDK

### <h3 id="generateotp">GenerateOtp:</h3>

The Generate OTP API is used to start the process of getting a secret API key. When this API is called, a One-Time Password (OTP) is sent to the user's registered mobile number and email ID. This OTP is required for the next step of API key generation.

    
#### Sample Generate Otp Request:
```typescript
const otpApi = new GenerateOtpApi();
const otpResponse = await otpApi.generateOTP({ uid: "XX1234" });
```

#### Sample Generate Otp Response:
```json
{
    "serverTime": "17/12/25 09:40:58",
    "msgId": "1e439d95-5e57-4810-b57e-df94e74776ea",
    "status": "Success",
    "statusMessage": "OTP sent to your mobile and email."
}
```

### <h3 id="generatesecretapikey">GenerateSecretAPIKey:</h3>

The Secret Key Generator API is used to generate a secret API key using a valid user ID and the OTP received from the Generate OTP API. Once the request is successful, the secret API key is sent to the user's registered email ID. Do not share your secret API key with anyone. The secret API key does not have an expiry. You can use the same secret API key to generate the access token. To generate a new secret API key, you must start again with the OTP generation flow.

    
#### Sample Generate Secret APIKey Request:
```typescript
const secretKeyApi = new SecretKeyGenerateApi();
const secretKeyResponse = await secretKeyApi.secretKey({
  uid: "XX1234",
  otp: "XXXX",
});
```
 
#### Sample Generate Secret APIKey Response:
```json
{
    "serverTime": "17/12/25 10:02:41",
    "msgId": "73d115fd-ed3a-47f2-ae04-f40083c3bccf",
    "status": "Success",
    "statusMessage": "The secret API key has been sent to your email."
}
```

### <h3 id="generateaccesstoken">GenerateAccessToken:</h3>

The Token API is used to generate an access token using a valid user ID and the secret API key received from the Secret Key Generator API on your registered email ID. The access token is valid for one day. It expires before 8:00 AM the next day. If the access token expires, you can generate a new access token using the same secret API key.

    
#### Sample Generate AccessToken Request:
```typescript
const accessTokenApi = new AccessTokenApi();
const accessTokenResponse = await accessTokenApi.accessToken({
  uid: "XX1234",
  secretApiKey: "XXXXXXXXXXXXXXXXX",
});
```
 
#### Sample Generate AccessToken Response:
```json
{
    "serverTime": "17/12/25 10:15:08",
    "msgId": "66b290f4-343e-4e08-85e5-67f708feb5f0",
    "status": "Success",
    "accessToken": "XXXXXXXXXXXXXiSUg_Ps6A942Lif"
}
```

### <h3 id="ipregistration">IpRegistration:</h3>

The Ip Register API is used to register the primary and secondary static IP addresses for a client. Once IPs are registered, the client can access the APIs only from these IP addresses. The IP address must be a valid IPv4 address. If a user tries to access the API from any other IP address, the request will be rejected with an error.

    
#### Sample Ip Registration Request:
```typescript
const ipApi = new IpRegisterApi();
const ipResponse = await ipApi.ipRegister({
  clientId: "XX1234",
  primaryIp: "XXX.XX.XX.XXX",
  secondaryIp: "XXX.XX.XX.XXX",
  password: "XXX@123",
});
```
 
#### Sample Ip Registration Response:
```json
{
    "serverTime": "29/01/26 10:46:06",
    "msgId": "d5f083f3-1b04-4b97-9385-1e578fdfeb7a",
    "status": "Success",
    "statusMessage": "Client IPs registered successfully",
    "data": {
        "user_id": "DV99999",
        "primary_ip": "XXX.XX.XX.XXX",
        "secondary_ip": "XXX.XX.XX.XXX",
        "ip_updated_at": "2026-01-29T05:16:07.000Z"
    }
}
```

### <h3 id="ipupdate">IPUpdate:</h3>

The IP Update API is used to update the primary and/or secondary static IP addresses for a client. Once the IPs are updated, the client can access the APIs only from the newly registered IP addresses. A user is allowed to update the IP addresses only once per calendar week.

    
#### Sample Ip Update Request:
```typescript
const ipUpdateApi = new IpUpdateApi();
const ipUpdateResponse = await ipUpdateApi.ipUpdate({
  clientId: "XX1234",
  primaryIp: "XXX.XX.XX.XXX",
  secondaryIp: "XXX.XX.XX.XXX",
  password: "XX@123",
});
```
 
#### Sample Ip Update Response:
```json
{
    "serverTime": "29/01/26 10:46:06",
    "msgId": "d5f083f3-1b04-4b97-9385-1e578fdfeb7a",
    "status": "Success",
    "statusMessage": "Client IPs updated successfully",
    "data": {
        "user_id": "DV99999",
        "primary_ip": "XXX.XX.XX.XXX",
        "secondary_ip": "XXX.XX.XX.XXX",
        "ip_updated_at": "2026-01-29T05:16:07.000Z"
    }
}
```

### <h3 id="personalindex">PersonalIndex:</h3>

The Index Data API shows the user's personal index. It shows the overall profit and loss of all the trades done by the user.

    
#### Sample Personal Index Request:
```typescript
const indexDataApi = new IndexDataApi();
const indexResponse = await indexDataApi.getIndexData(xSessionToken);
```
 
#### Sample Personal Index Response:
```json
{
    "serverTime": "03/06/24 18:46:17",
    "msgId": "0cb0cf30-4b27-494e-9048-6313671cf00a",
    "status": "Success",
    "statusMessage": "Index Data retrieved successfully",
    "indexData": {
        "indexName": "MOHAMMAD Index",
        "networth": "269.53",
        "indexData": {
            "index": "1.72",
            "indexChange": "0.05",
            "indexChangePercentage": "3.01",
            "latestTime": "2024-06-03 17:01:00",
            "networthChange": "7.88",
            "networthChangePercentage": "3.01",
            "fundReceipt": "0.00"
        }
    }
}
```

### <h3 id="equity_search">Search Equity & Derivative:</h3>

   This API is used to search equity, derivatives and commodity scrips based on user provided search symbol and exchange name.

#### Parameters:

    xSessionToken, exchange, searchSymbolName
    
#### Sample Search Request:

```typescript
const searchApi = new SearchEquityDerivativeApi();
const searchResponse = await searchApi.searchEquityDerivative(xSessionToken, "GOLD", "MFO");
```
   
#### Sample Search Response:

```json
{
    "msgId": "7356eb6b-ab17-4b2c-84e7-46c9280e15d4",
    "status": "Success",
    "statusMessage": "Request Successful",
    "commodityValues": [
        {
            "tradingSymbol": "GOLD20FEBFUT",
            "instrumentName": "FUTCOM",
            "quantityInLots": "9304",
            "exchange": "MFO"
        }
    ]
}
```

###  <h3 id="quote">Quote:</h3>

   This API can be used to get market depth details for a specific equity scrip including but not limited to values like last trade price, previous close price, change value, change percentage, bids/asks, upper and lower circuit limits etc. This helps user with market picture of an equity scrip using which he will be able to place an order.

#### Parameters:

    xSessionToken, exchange, symbolName
    
#### Sample Quote request:

```typescript
const quoteApi = new QuoteApi();
const quote = await quoteApi.getQuote(xSessionToken, "SBIN", EXCHANGE_NSE);
```
     
#### Sample Quote Response:

```json
{
    "serverTime": "26/05/20 14:09:56",
    "msgId": "70414ca5-230e-467b-81cb-62af0a5f2b95",
    "status": "Success",
    "statusMessage": "Quote details retrieved successfully",
    "symbolName": "SBIN",
    "tradingSymbol": "SBIN-EQ",
    "exchange": "NSE",
    "companyName": "STATE BANK OF INDIA",
    "lastTradedTime": "26/05/2020 14:09:55",
    "lastTradedPrice": "151.00",
    "previousClose": "150.85",
    "changeValue": "0.15",
    "changePercentage": "0.10",
    "lastTradedQuantity": "16",
    "lowerCircuitLimit": "135.80",
    "upperCircuitLimit": "165.90",
    "averagePrice": "151.96",
    "openValue": "152.40",
    "highValue": "153.20",
    "lowValue": "150.55",
    "closeValue": "150.85",
    "totalBuyQuantity": "3140492",
    "totalSellQuantity": "9899407",
    "totalTradedValue": "592.47019 (Crs)",
    "totalTradedVolume": "38988562",
    "yearlyHighPrice": "373.80",
    "yearlyLowPrice": "149.45",
    "bestBids": [
        {
            "number": "1",
            "quantity": "9105",
            "price": "150.95"
        }
    ],
    "listingId": "3045_NSE"
}
```

###  <h3 id="indexquote">IndexQuote:</h3>

Getting Index Quote details for a specific Indicies. This helps user with market picture of an specific Index Details.

#### Parameters:

    xSessionToken, indexName
    
#### Sample Quote request:

```typescript
const quoteApi = new QuoteApi();
const indexQuote = await quoteApi.getIndexQuote(xSessionToken, "NIFTY 50");
```
     
#### Sample Quote Response:
```json
{
    "serverTime": "03/06/24 18:19:04",
    "msgId": "8c5dbe1f-cb01-4fd8-a5e9-49202bd4a121",
    "status": "Success",
    "statusMessage": "Index Quote details retrieved successfully",
    "indexDetails": [
        {
            "indexName": "Nifty 50",
            "listingId": "-21",
            "lastTradedTime": "2024-06-03 15:32:05.0",
            "spotPrice": 23263.9,
            "changePercentage": 3.25,
            "averagePrice": 0.0,
            "openValue": 23337.9,
            "highValue": 23338.7,
            "lowValue": 23062.3,
            "closeValue": 23263.9,
            "totalBuyQuantity": 0,
            "totalSellQuantity": 0,
            "totalTradedValue": 0,
            "totalTradedVolume": 0,
            "change": 733.2
        }
    ]
}
```


###  <h3 id="multiquote">MultiQuote:</h3>

#### Parameters:

    xSessionToken, BSE, NSE, NFO, BFO, INDEX, CDS, MFO, MCX
    
#### Sample multi Quote request:

```typescript
const multiQuoteApi = new MultiQuoteApi();
const response = await multiQuoteApi.postMultiQuote(xSessionToken, {
  NSE: ["BAJAJ-AUTO"],
  BSE: ["INFY"],
});
```
     
#### Sample Quote Response:
```json
{
    "serverTime": "03/06/24 18:49:07",
    "msgId": "6dcbebfd-4d91-4b42-85c1-c8d094f705da",
    "status": "Success",
    "statusMessage": "Multiquotes data retrieved successfully",
    "multiQuotes": [
        {
            "exchange": "BSE",
            "symbolName": "INFY",
            "tradingSymbol": "INFY",
            "companyName": "INFOSYS LTD.",
            "lastTradePrice": "1405.90",
            "change": "-0.35",
            "changePercent": "-0.02"
        }
    ]
}
```

###  <h3 id="spanmargin">SpanMargin:</h3>

#### Parameters:

    xSessionToken, exchange, tradingSymbol, qty
    
#### Sample SpanMargin request:

```typescript
const spanMarginApi = new SpanMarginApi();
const spanResponse = await spanMarginApi.postSpanMarginData(xSessionToken, {
  request: [
    { exchange: "NFO", tradingSymbol: "NIFTY06JUN2423200PE", qty: "25" },
    { exchange: "NFO", tradingSymbol: "NIFTY24JUNFUT", qty: "25" },
  ],
});
```

#### Sample SpanMargin Response:
```json
{
    "serverTime": "03/06/24 19:31:08",
    "msgId": "9988d21e-c5d6-4e18-a024-5cdc21004dda",
    "status": "Success",
    "statusMessage": "Span margin calculated",
    "spanDetails": {
        "totalRequirement": "13666.21",
        "spanRequirement": "1941.21",
        "exposureMargin": "11725.00",
        "spreadBenefit": "00.00"
    }
}
```

### <h3 id="optionchain">OptionChain:</h3>

To search OptionChain for equity, derivatives and commodity scrips based on user provided search symbol and exchange name. 
      
#### Parameters:

    xSessionToken, searchSymbolName, exchange, expiryDate, strikePrice, optionType
    
#### Sample OptionChain Request:

```typescript
const optionApi = new OptionApi();
const optionChainResponse = await optionApi.getOptionContracts(
  xSessionToken, "INFY", EXCHANGE_NSE, "2020-06-25", "950", "CE"
);
```

#### Sample OptionChain Response:

```json
{
    "serverTime": "01/06/20 18:49:55",
    "msgId": "5e1e2e47-6565-457e-9d10-4e2b7d09d15b",
    "status": "Success",
    "statusMessage": "OptionChain details retrived successfully. ",
    "optionChainDetails": [
        {
            "tradingSymbol": "INFY20JUN950CE",
            "exchange": "NFO",
            "symbol": "74352_NFO",
            "strikePrice": "950.00",
            "expiryDate": "2020-06-25",
            "instrument": "OPTSTK",
            "optionType": "CE",
            "underLyingSymbol": "INFY",
            "spotPrice": "699.55",
            "lastTradedPrice": "0.00",
            "openInterest": "0",
            "openInterestChange": "0",
            "volume": "0"
        }
    ]
}
```


### <h3 id="futurechain">FutureChain:</h3>

To search FutureChain for equity, derivatives and commodity scrips based on user provided search symbol and exchange name. 
      
#### Parameters:

    xSessionToken, searchSymbolName, exchange, expiryDate
    
#### Sample FutureChain Request:

```typescript
const futureApi = new FutureApi();
const futureChainResponse = await futureApi.getFutureContracts(
  xSessionToken, "ITC", EXCHANGE_NFO, "2024-06-27"
);
```

#### Sample FutureChain Response:
```json
{
    "serverTime": "03/06/24 18:16:22",
    "msgId": "8f9113de-bc27-4d14-be92-71426e024c32",
    "status": "Success",
    "statusMessage": "Future chain details retrived successfully. ",
    "futureChainDetails": [
        {
            "tradingSymbol": "ITC24JUNFUT",
            "exchange": "NFO",
            "symbol": "52178_NFO",
            "expiryDate": "2024-06-27",
            "instrument": "FUTSTK",
            "underLyingSymbol": "ITC",
            "spotPrice": 430.35,
            "lastTradedPrice": "426.75",
            "openInterest": 107800000,
            "openInterestInLot": 67375,
            "openInterestChange": 1196800,
            "openInterestChangeInLot": 748,
            "oichangePer": "1.12",
            "volume": 24145600,
            "bestBids": [
                { "number": 1, "quantity": "1600", "price": "426.7000" }
            ],
            "bestAsks": [
                { "number": 1, "quantity": "1600", "price": "426.7500" }
            ]
        }
    ]
}
```


###  <h3 id="limit">UserLimits:</h3>

Gets the user cash balances, available margin for trading in equity and commodity segments.
      
#### Parameters:

    xSessionToken
    
#### Sample UserLimit Request:

```typescript
const userLimitsApi = new UserLimitsApi();
const limits = await userLimitsApi.getLimits(xSessionToken);
```

#### Sample UserLimit Response:

```json
{
    "serverTime": "29/05/20 15:34:05",
    "msgId": "7792c01b-618d-46b5-86d2-1a1c647c72d0",
    "equityLimit": {
        "grossAvailableMargin": "50000000000",
        "payInToday": "0",
        "notionalCash": "0",
        "marginUsed": "92",
        "netAvailableMargin": "49999999908"
    },
    "commodityLimit": {
        "grossAvailableMargin": "0",
        "payInToday": "0",
        "notionalCash": "0",
        "marginUsed": "0",
        "netAvailableMargin": "0"
    }
}
```

### <h3 id="placeorder">PlaceOrder:</h3>

To place an equity/derivative order with the exchange i.e the place order request typically registers the order with OMS and when it happens successfully, a success response is returned. Successful placement of an order via the API does not imply its successful execution. So when an order is successfully placed the PlaceOrder API returns an OrderNumber in response, and the actual order status can be checked separately using the OrderStatus API call. This is for Placing CNC, MIS and NRML Orders.
    
#### Parameters:

    xSessionToken, symbolName, exchange, transactionType, orderType, price, quantity, disclosedQuantity, orderValidity, productType, afterMarketOrderFlag
    
#### Sample PlaceOrder Request:

```typescript
const ordersApi = new OrdersApi();
const placeOrder = await ordersApi.placeOrder(xSessionToken, {
  symbolName: "RELIANCE",
  exchange: EXCHANGE_BSE,
  transactionType: TRANSACTION_TYPE_BUY,
  orderType: ORDER_TYPE_LIMIT,
  quantity: "2",
  disclosedQuantity: "",
  price: "1369",
  orderValidity: VALIDITY_DAY,
  productType: PRODUCT_MIS,
  afterMarketOrderFlag: "NO",
});
```

#### Sample PlaceOrder Response:  

```json
{
    "serverTime": "29/05/20 12:43:06",
    "msgId": "f1330206-cb2f-42eb-9925-b7d825c07bdd",
    "orderNumber": "200529000000059",
    "status": "Success",
    "statusMessage": "MIS Order request placed successfully",
    "exchangeOrderStatus": "PENDING",
    "orderDetails": {
        "pendingQuantity": "2",
        "avgExecutionPrice": "0.00",
        "orderPlacedBy": "--",
        "tradingSymbol": "RELIANCE",
        "triggerPrice": "0.00",
        "exchange": "BSE",
        "totalQuantity": "2",
        "transactionType": "BUY",
        "productType": "MIS",
        "orderType": "L",
        "quantity": "2",
        "filledQuantity": "0",
        "orderPrice": "1600.0",
        "filledPrice": "0.00",
        "exchangeOrderNo": "1590728958294000024",
        "orderValidity": "DAY",
        "orderTime": "29/05/2020 12:43:04"
    }
}
```

### <h3 id="placeorderBO">PlaceOrderBO:</h3>

To place an equity/derivative BO order with the exchange i.e the place order BO request typically registers the order with OMS and when it happens successfully, a success response is returned. Successful placement of an order via the API does not imply its successful execution. So when an order is successfully placed the placeOrderBO returns an orderNumber in response, and the actual order status can be checked separately using the orderStatus API call.
        
#### Parameters:

    xSessionToken, exchange, symbolName, transactionType, orderType, quantity, disclosedQuantity, price, priceType, valueType, orderValidity, productType, squareOffValue, stopLossValue, trailingStopLoss
    
#### Sample PlaceOrderBO Request:

```typescript
const ordersApi = new OrdersApi();
const placeOrderBO = await ordersApi.placeOrderBO(xSessionToken, {
  symbolName: "TCS",
  exchange: EXCHANGE_BSE,
  transactionType: TRANSACTION_TYPE_BUY,
  orderType: ORDER_TYPE_LIMIT,
  quantity: "10",
  disclosedQuantity: "1",
  price: "2000",
  priceType: "LTP",
  valueType: "Absolute",
  orderValidity: VALIDITY_DAY,
  productType: PRODUCT_BO,
  squareOffValue: "100",
  stopLossValue: "50",
  trailingStopLoss: "30",
});
```

#### Sample PlaceOrderBO Response:
```json
{
    "serverTime": "01/06/20 14:58:38",
    "msgId": "de2d8caf-b76d-4a24-bb6c-fa654ed355bb",
    "orderNumber": "200601000000133",
    "status": "Success",
    "statusMessage": "Bracket Order request placed successfully",
    "exchangeOrderStatus": "EXECUTED",
    "orderDetails": {
        "pendingQuantity": "0",
        "avgExecutionPrice": "669.00",
        "orderPlacedBy": "--",
        "tradingSymbol": "INFY-EQ",
        "triggerPrice": "0.00",
        "exchange": "NSE",
        "totalQuantity": "10",
        "transactionType": "BUY",
        "productType": "BO",
        "orderType": "L",
        "quantity": "10",
        "filledQuantity": "10",
        "orderPrice": "669.0",
        "filledPrice": "669.00",
        "exchangeOrderNo": "1100000000030886",
        "orderValidity": "DAY",
        "orderTime": "01/06/2020 14:58:36"
    }
}
```

### <h3 id="placeorderCO">PlaceOrderCO:</h3>

To place an equity/derivative CO order with the exchange i.e the place order CO request typically registers the order with OMS and when it happens successfully, a success response is returned. Successful placement of an order via the API does not imply its successful execution. So when an order is successfully placed the placeOrderCO returns an orderNumber in response, and the actual order status can be checked separately using the orderStatus API call.
        
#### Parameters:

    xSessionToken, symbolName, exchange, transactionType, orderType, price, quantity, disclosedQuantity, orderValidity, productType, triggerPrice
    
#### Sample PlaceOrderCO Request:

```typescript
const ordersApi = new OrdersApi();
const placeOrderCO = await ordersApi.placeOrderCO(xSessionToken, {
  symbolName: "RELIANCE",
  exchange: EXCHANGE_NSE,
  transactionType: TRANSACTION_TYPE_BUY,
  orderType: ORDER_TYPE_LIMIT,
  quantity: "15",
  price: "2000",
  disclosedQuantity: "",
  orderValidity: VALIDITY_DAY,
  productType: PRODUCT_CO,
  triggerPrice: "1300",
});
```
    
#### Sample PlaceOrderCO Response:

```json
{
    "serverTime": "01/06/20 14:36:34",
    "msgId": "b0d3192d-824f-4493-90cf-4657e827742e",
    "orderNumber": "200601000000129",
    "status": "Success",
    "statusMessage": "CO Order request placed successfully",
    "exchangeOrderStatus": "EXECUTED",
    "orderDetails": {
        "pendingQuantity": "0",
        "avgExecutionPrice": "669.00",
        "orderPlacedBy": "--",
        "tradingSymbol": "INFY-EQ",
        "triggerPrice": "650.00",
        "exchange": "NSE",
        "totalQuantity": "15",
        "transactionType": "BUY",
        "productType": "CO",
        "orderType": "L",
        "quantity": "15",
        "filledQuantity": "15",
        "orderPrice": "689.05",
        "filledPrice": "669.00",
        "exchangeOrderNo": "1100000000030191",
        "orderValidity": "DAY",
        "orderTime": "01/06/2020 14:36:32"
    }
}
```

### <h3 id="bulkorder">BulkOrder (v3.2.0):</h3>

Submit multiple regular orders in a single request. Each entry of `orders` is a standard order request (same shape used by <a href="#placeorder">PlaceOrder</a>).

#### Parameters:

    sessionToken, BulkOrderRequest { orders: OrderRequest[] }

#### Sample BulkOrder Request:
```typescript
import {
  BulkOrderApi,
  EXCHANGE_NSE,
  ORDER_TYPE_LIMIT,
  PRODUCT_MIS,
  TRANSACTION_TYPE_BUY,
  VALIDITY_DAY,
} from "samco-bridge-node";

const ordersApi = new BulkOrderApi();

const o1 = {
  symbolName: "SBIN",
  exchange: EXCHANGE_NSE,
  transactionType: TRANSACTION_TYPE_BUY,
  orderType: ORDER_TYPE_LIMIT,
  quantity: "1",
  price: "520.50",
  orderValidity: VALIDITY_DAY,
  productType: PRODUCT_MIS,
};

// const o2 = { ... configure second order ... };

const response = await ordersApi.bulkOrder(sessionToken, {
  orders: [o1 /*, o2 */],
});
```

#### Sample BulkOrder Response:
```json
{
    "serverTime": "29/01/26 10:46:06",
    "msgId": "d5f083f3-1b04-4b97-9385-1e578fdfeb7a",
    "status": "Success",
    "statusMessage": "Bulk order processed"
}
```


###  <h3 id="modify_order">Modify Order:</h3>

   User would be able to modify some attributes of an order as long as it is with open/pending status in system. For modification order identifier is mandatory. With order identifier you need to send the optional parameter(s) which needs to be modified. In case the optional parameters aren't sent, the default will be considered from the original order. Modifiable attributes include quantity, Order Type (L, SL). This API cannot be used for modifying attributes of an executed/rejected/cancelled order. Only the attribute that needs to be modified should be sent in the request alongwith the Order Identifier.

#### Parameters:

    xSessionToken, orderNumber, orderType, quantity, disclosedQuantity, orderValidity, price, triggerPrice, parentOrderId
    
#### Sample ModifyOrder Request:

```typescript
const ordersApi = new OrdersApi();
const modifyOrder = await ordersApi.modifyOrder(xSessionToken, "200529000000059", {
  quantity: "20",
});
```

#### Sample ModifyOrder Response:

```json
{
    "serverTime": "29/05/20 14:12:42",
    "msgId": "773d0380-6f07-4269-93e5-a6d4b2b8c5d3",
    "orderNumber": "200529000000059",
    "status": "Success",
    "statusMessage": "Order 200529000000059 modified successfully",
    "exchangeOrderStatus": "PENDING",
    "orderDetails": {
        "pendingQuantity": "20",
        "avgExecutionPrice": "0.00",
        "orderPlacedBy": "DA35672",
        "tradingSymbol": "RELIANCE",
        "triggerPrice": "0.00",
        "exchange": "BSE",
        "totalQuantity": "20",
        "transactionType": "BUY",
        "productType": "MIS",
        "orderType": "L",
        "quantity": "20",
        "filledQuantity": "0",
        "orderPrice": "1600.0",
        "filledPrice": "0.00",
        "exchangeOrderNo": "1590728958294000024",
        "orderValidity": "DAY",
        "orderTime": "29/05/2020 14:12:39"
    }
}
```

### <h3 id="orderbook">OrderBook:</h3>

   Orderbook retrieves and displays details of all orders placed by the user on a specific day. This API returns all states of the orders, namely, open, pending, rejected and executed ones.
       
#### Parameters:

    xSessionToken
    
#### Sample OrderBook Request:

```typescript
const ordersApi = new OrdersApi();
const orderBook = await ordersApi.getOrderBook(xSessionToken);
```

#### Sample OrderBook Response:

```json
{
    "serverTime": "29/05/20 15:43:49",
    "msgId": "d2b6770c-348b-4bd0-91fa-feb5b3d10d8d",
    "status": "Success",
    "orderBookDetails": [
        {
            "orderNumber": "200529000000200",
            "exchange": "NSE",
            "tradingSymbol": "RELIANCE",
            "transactionType": "SELL",
            "productCode": "CO",
            "orderType": "SL-M",
            "orderPrice": "1290.00",
            "triggerPrice": "1290.00",
            "orderValidity": "DAY",
            "orderStatus": "Trigger Pending",
            "filledQuantity": "0",
            "fillPrice": "0.00",
            "averagePrice": "0.00",
            "rejectionReason": "--",
            "exchangeOrderNumber": "1100000000085407"
        }
    ]
}
```

### <h3 id="triggerorder">TriggerOrders:</h3>

This API is used to get the trigger order numbers in case of BO and CO orders so that their attribute values can be modified. For BO orders, it will give the order identifiers for Stop loss leg and target leg. For CO orders, it will return order identifier of stop loss leg only. Using the order identifier, the user would be able to modify the order attributes using the modifyOrder API. 
        
#### Parameters:

    xSessionToken, orderNumber
    
#### Sample TriggerOrders Request:

```typescript
const ordersApi = new OrdersApi();
const triggerOrders = await ordersApi.getTriggerOrderNumbers(xSessionToken, "200514000000041");
```

#### Sample TriggerOrders Response:

```json
{
    "serverTime": "01/06/20 14:06:46",
    "msgId": "2172fc5c-a72b-4c79-bb43-398bebf85af4",
    "status": "Success",
    "statusMessage": "SubOrder details retrieved successfully.",
    "triggerOrders": [
        {
            "targetOrderNo": "200601000000027",
            "orderStatus": "Open",
            "orderPrice": "760.10",
            "triggerPrice": "0.00",
            "mainOrderNo": "200601000000026"
        },
        {
            "stopLossOrderNo": "200601000000028",
            "orderStatus": "Cancelled",
            "orderPrice": "650.00",
            "triggerPrice": "650.00",
            "mainOrderNo": "200601000000026"
        }
    ]
}
```

###  <h3 id="order_status">Order Status:</h3>

   Get status of an order placed previously. This API returns all states of the orders, but not limited to open, pending, and partially filled ones.
     
#### Parameters:

    xSessionToken, orderNumber
    
#### Sample OrderStatus Request:

```typescript
const ordersApi = new OrdersApi();
const orderStatus = await ordersApi.getOrderStatus(xSessionToken, "200618000000010");
```

#### Sample OrderStatus Response:

```json
{
    "serverTime": "29/05/20 13:31:37",
    "msgId": "a92ce76f-5970-44c5-a1b8-1038537b28c6",
    "orderNumber": "200529000000059",
    "orderStatus": "PENDING",
    "orderDetails": {
        "pendingQuantity": "2",
        "avgExecutionPrice": "0.00",
        "orderPlacedBy": "--",
        "tradingSymbol": "RELIANCE",
        "triggerPrice": "0.00",
        "exchange": "BSE",
        "totalQuantity": "2",
        "transactionType": "BUY",
        "productType": "MIS",
        "orderType": "L",
        "quantity": "2",
        "filledQuantity": "0",
        "orderPrice": "1600.0",
        "filledPrice": "0.00",
        "exchangeOrderNo": "1590728958294000024",
        "orderValidity": "DAY",
        "orderTime": "29/05/2020 12:43:04"
    }
}
```

###  <h3 id="cancel_order">Cancel Order:</h3>

   An order which is open or pending in system can be cancelled. In other words, cancellation cannot be initiated for already Executed, Rejected orders. This is for CNC, MIS and NRML Orders.
      
#### Parameters:

    xSessionToken, orderNumber
    
#### Sample CancelOrder Request:

```typescript
const ordersApi = new OrdersApi();
const cancelResponse = await ordersApi.cancelOrder(xSessionToken, "200529000000059");
```
    
#### Sample CancelOrder Response:

```json
{
    "serverTime": "29/05/20 14:50:36",
    "msgId": "25d6d99b-3224-4a77-b129-a5d0bd38349b",
    "status": "Success",
    "orderNumber": "200529000000059",
    "statusMessage": "Order cancelled successfully"
}
```

### <h3 id="cancelorderCO">CancelOrderCO:</h3>

   For Cancellation/exit of CO orders pass main leg Order number. If main leg is in Open/Pending state that order will be cancelled. If the main leg is executed and the sublegs are created and in open/Trigger pending state, the order will be exited. If the main leg is executed and if Stop loss is hit, API will return error message "SubOrder is in Executed status. Cannot exit/cancel such orders.
  
#### Parameters:

    xSessionToken, orderNumber
    
#### Sample CancelOrderCO Request:

```typescript
const ordersApi = new OrdersApi();
const cancelResponse = await ordersApi.cancelOrderCO(xSessionToken, "200618000000075");
```

#### Sample CancelOrderCO Response:

```json
{
    "serverTime": "01/06/20 16:06:25",
    "msgId": "3b7ed673-9a5b-4014-afdf-158c8490beba",
    "status": "Success",
    "orderNumber": "200601000000129",
    "statusMessage": "Cover Order 200601000000129exited successfully"
}
```

### <h3 id="cancelorderBO">CancelOrderBO:</h3>

   For Cancellation/exit of BO orders pass main leg Order number. If main leg is in Open/Pending state that order will be cancelled. If the main leg is executed and the sublegs are created and in open/Trigger pending state, the order will be exited. If the main leg is executed and if either of Stop loss or target is hit, API will return error message "SubOrder is in Executed status. Cannot exit/cancel such orders.
        
#### Parameters:

    xSessionToken, orderNumber
    
#### Sample CancelOrderBO Request:

```typescript
const ordersApi = new OrdersApi();
const cancelResponse = await ordersApi.cancelOrderBO(xSessionToken, "200619000000003");
```

#### Sample CancelOrderBO Response:

```json
{
    "serverTime": "01/06/20 16:11:24",
    "msgId": "c02e4a34-cb58-4822-8988-3736b22831e5",
    "status": "Success",
    "orderNumber": "200601000000134",
    "statusMessage": "Bracket Order exited successfully"
}
```

### <h3 id="addGtt">AddGTT:</h3>

GTT (Good Till Triggered) is a feature that allows users to place buy or sell orders of any stock at market or limit price. These orders are executed (triggered) once the market price of the stock reaches your desired price i.e the price you mentioned in the GTT Order. <a href="https://www.samco.in/gtt-order">Read More....</a>
    
#### Parameters:

    xSessionToken, symbolName, transactionType, quantity, productType, orderType, triggerPrice, limitPrice
    
#### Sample Add GTT Request:

```typescript
const gttApi = new GTTApi();
const gttCreateResponse = await gttApi.postGTTRequest(xSessionToken, {
  exchange: EXCHANGE_NSE,
  symbolName: "IDEA",
  transactionType: TRANSACTION_TYPE_BUY,
  orderType: ORDER_TYPE_LIMIT,
  quantity: "10",
  productType: PRODUCT_NRML,
  triggerPrice: "14",
  limitPrice: "14.50",
});
```

#### Sample Add GTT Response:  
```json
{
    "serverTime": "31/05/24 15:21:50",
    "msgId": "06fb18e6-6790-4700-8f26-258f1e31fd76",
    "status": "Success",
    "statusMessage": "GTT CREATED",
    "gttSummaryId": "944090",
    "orderDetails": {
        "productType": "NRML",
        "orderType": "L",
        "triggerPrice": "14",
        "transactionType": "BUY",
        "triggerId": "1344160",
        "symbol": "14366_NSE",
        "symbolName": "IDEA",
        "createdAt": "2024-05-31 15:21:50"
    }
}
```

### <h3 id="modifyGtt">ModifyGTT:</h3>

Modifying a GTT (Good Till Triggered) order allows investors to adjust the parameters of their existing GTT orders. This can include changing the trigger price, altering the quantity of the order, productType, limitPrice or modifying the order type. 
    
#### Parameters:

    xSessionToken, exchange, symbolName, transactionType, quantity, productType, orderType, triggerPrice, limitPrice, gttSummaryId
    
#### Sample Modify GTT Request:

```typescript
const gttApi = new GTTApi();
const gttModifyResponse = await gttApi.putGTTRequest(xSessionToken, {
  exchange: EXCHANGE_NSE,
  symbolName: "IDEA",
  transactionType: TRANSACTION_TYPE_BUY,
  quantity: "5",
  productType: PRODUCT_NRML,
  orderType: ORDER_TYPE_LIMIT,
  triggerPrice: "14.8",
  limitPrice: "14.8",
  gttSummaryId: 944090,
});
```

#### Sample Modify GTT Response:  

```json
{
    "serverTime": "31/05/24 15:23:29",
    "msgId": "26eba130-ce8c-4c4e-b661-a1c90292bf11",
    "status": "Success",
    "statusMessage": "GTT MODIFIED",
    "gttSummaryId": "944115",
    "orderDetails": {
        "productType": "NRML",
        "orderType": "L",
        "triggerPrice": "14.8",
        "transactionType": "BUY",
        "limitPrice": "14.8",
        "symbol": "14366_NSE",
        "symbolName": "IDEA",
        "quantity": "5"
    }
}
```

### <h3 id="deleteGtt">DeleteGTT:</h3>

Deleting a GTT order cancels it before execution, removing it from the exchange's order book and preventing future execution. Once GTT is triggered, deletion is not possible.
    
#### Parameters:

    xSessionToken, gttSummaryId
    
#### Sample Delete GTT Request:

```typescript
const gttApi = new GTTApi();
const gttDeleteResponse = await gttApi.deleteGTTRequest(xSessionToken, { gttSummaryId: 944115 });
```

#### Sample Delete GTT Response: 

```json
{
    "serverTime": "31/05/24 15:25:07",
    "msgId": "f8d8d409-affa-4251-9756-923c09e21294",
    "status": "Success",
    "statusMessage": "GTT Deleted successfully",
    "gttSummaryId": "944115",
    "orderDetails": {
        "userId": "RXX12XX"
    }
}
```

### <h3 id="addOco">AddOCO:</h3>

GTT (Good Till Triggered) is a feature that allows users to place buy or sell orders of any stock at market or limit price. These orders are executed (triggered) once the market price of the stock reaches your desired price i.e the price you mentioned in the GTT Order. <a href="https://www.samco.in/gtt-order">Read More....</a>
    
#### Parameters:

    xSessionToken, symbolName, transactionType, quantity, productType, orderType, targetTriggerPrice, targetLimitPrice, stoplossTriggerPrice, stoplossLimitPrice
    
#### Sample Add OCO Request:

```typescript
const gttOcoApi = new GTTOCOApi();
const gttocoResponse = await gttOcoApi.postGTTOCORequest(xSessionToken, {
  exchange: "NSE",
  symbolName: "IDEA",
  transactionType: "SELL",
  quantity: "1",
  productType: "CNC",
  orderType: "L",
  targetTriggerPrice: "17",
  targetLimitPrice: "16",
  stoplossTriggerPrice: "13",
  stoplossLimitPrice: "12",
});
```
		     
#### Sample Add OCO Response:  

```json
{
    "serverTime": "31/05/24 17:35:52",
    "msgId": "eda2be26-8f8e-4319-9afc-2d256fafd2bb",
    "status": "Success",
    "statusMessage": "GTT CREATED",
    "gttSummaryId": "944425",
    "orderDetails": {
        "transactionType": "SELL",
        "symbol": "14366_NSE",
        "symbolName": "IDEA",
        "productType": "CNC",
        "orderType": "L",
        "target": {
            "quantity": "1",
            "triggerPrice": "17",
            "limitPrice": "16",
            "type": "TARGET",
            "triggerId": "1344615"
        },
        "stopLoss": {
            "quantity": "1",
            "triggerPrice": "13",
            "limitPrice": "12",
            "type": "STOPLOSS",
            "triggerId": "1344620"
        }
    }
}
```

### <h3 id="modifyOco">ModifyOCO:</h3>

Modifying a GTT (Good Till Triggered) order allows investors to adjust the parameters of their existing GTT orders. This can include changing the trigger price, altering the quantity of the order, productType, limitPrice or modifying the order type. 
    
#### Parameters:

    xSessionToken, exchange, symbolName, transactionType, quantity, productType, orderType, targetTriggerPrice, targetLimitPrice, stoplossTriggerPrice, stoplossLimitPrice, gttSummaryId
    
#### Sample Modify OCO Request:

```typescript
const gttOcoApi = new GTTOCOApi();
const gttModifyResponse = await gttOcoApi.putGTTOCORequest(xSessionToken, {
  exchange: "NSE",
  symbolName: "IDEA",
  transactionType: "SELL",
  quantity: "2",
  productType: "NRML",
  orderType: "L",
  targetTriggerPrice: "18",
  targetLimitPrice: "17",
  stoplossTriggerPrice: "14",
  stoplossLimitPrice: "13",
  gttSummaryId: "944425",
});
```
		     
#### Sample Modify OCO Response:  

```json
{
    "serverTime": "31/05/24 17:43:23",
    "msgId": "2589a516-d3cd-4408-863c-99d5ba6de971",
    "status": "Success",
    "statusMessage": "GTT MODIFIED",
    "gttSummaryId": "944430",
    "orderDetails": {
        "transactionType": "SELL",
        "orderType": "L",
        "symbol": "14366_NSE",
        "symbolName": "IDEA",
        "productType": "NRML",
        "target": {
            "limitPrice": "17",
            "triggerId": "1344625",
            "triggerPrice": "18",
            "type": "TARGET",
            "quantity": "2"
        },
        "stopLoss": {
            "limitPrice": "13",
            "triggerId": "1344630",
            "triggerPrice": "14",
            "type": "STOPLOSS",
            "quantity": "2"
        }
    }
}
```

### <h3 id="deleteOco">DeleteOCO:</h3>

Deleting an OCO (One-Cancels-the-Other) order involves canceling both legs of the order simultaneously. In an OCO order, when one part of the order is executed, the other part is automatically canceled. However, if the investor decides to delete the entire OCO order before either part is executed, they can do so using the delete OCO API.

#### Parameters:

    xSessionToken, gttSummaryId
    
#### Sample Delete OCO Request:

```typescript
const gttOcoApi = new GTTOCOApi();
const gttDeleteResponse = await gttOcoApi.deleteGTTOCORequest(xSessionToken, { gttSummaryId: 944430 });
```
		     
#### Sample Delete OCO Response:  
```json
{
    "serverTime": "31/05/24 19:05:44",
    "msgId": "ddeb9d0e-aff8-4e50-8e8f-6d2189056dfd",
    "status": "Success",
    "statusMessage": "GTT Deleted successfully",
    "gttSummaryId": "944430",
    "orderDetails": {
        "clientId": "RX31XXX"
    }
}
```

### <h3 id="listGttOco">ListGttOco:</h3>

Using the list OCO, we can retrieve the list of active GTT OCO, triggered GTT OCO, and expired GTT OCO.
    
#### Parameters:

    xSessionToken, listType
    
#### Sample ListGttOco Request:

```typescript
const gttApi = new GTTApi();
const gttListResponse = await gttApi.getGTTListRequest(xSessionToken, "active");
```
		     
#### Sample ListGttOco Response:  
```json
{
    "serverTime": "31/05/24 15:24:23",
    "msgId": "b9637ccf-579a-4cd7-ac7b-4fa8ba11ee6e",
    "status": "Success",
    "statusMessage": "List of GTT / OCO orders received.",
    "orderDetails": [
        {
            "summary": {
                "id": 944115,
                "userId": "RXX12XX",
                "symbol": "14366_NSE",
                "symbolName": "IDEA",
                "orderType": "L",
                "productType": "NRML",
                "gttType": "SINGLE",
                "validTill": "FOREVER",
                "createdAt": "2024-05-31 15:23:30",
                "deletedAt": "",
                "gttSummaryId": "944115",
                "isExpired": false
            },
            "triggers": {}
        }
    ]
}
```

### <h3 id="tradebook">TradeBook:</h3>

Details of all successfully executed orders placed by the user.
       
#### Parameters:

    xSessionToken
    
#### Sample TradeBook Request:

```typescript
const tradeBookApi = new TradeBookApi();
const tradeBook = await tradeBookApi.getTradeBook(xSessionToken);
```
    
#### Sample TradeBook Response:
```json
{
    "serverTime": "29/05/20 15:43:49",
    "msgId": "d2b6770c-348b-4bd0-91fa-feb5b3d10d8d",
    "status": "Success",
    "orderBookDetails": [
        {
            "orderNumber": "200529000000200",
            "exchange": "NSE",
            "tradingSymbol": "RELIANCE",
            "transactionType": "SELL",
            "productCode": "CO",
            "orderType": "SL-M",
            "orderPrice": "1290.00",
            "orderValidity": "DAY",
            "orderStatus": "Complete",
            "filledQuantity": "0",
            "fillPrice": "0.00",
            "averagePrice": "0.00"
        }
    ]
}
```

### <h3 id="positions">Positions:</h3>

Get position details of the user (The details of equity, derivative, commodity, currency borrowed or owned by the user).
        
#### Parameters:

    xSessionToken, positionType
    
#### Sample Positions Request:

```typescript
const positionsApi = new PositionsApi();
const positions = await positionsApi.getPositions(xSessionToken, POSITION_TYPE_DAY);
```
    
#### Sample Positions Response:

```json
{
    "serverTime": "01/06/20 15:13:06",
    "msgId": "9e143fb4-f9cb-4ea7-bd6d-bad6008816db",
    "positionDetails": [
        {
            "averagePrice": "669.00",
            "exchange": "NSE",
            "markToMarketPrice": "0.00",
            "lastTradedPrice": "669.00",
            "previousClose": "705.45",
            "productCode": "BO",
            "tradingSymbol": "INFY-EQ",
            "calculatedNetQuantity": "10.0",
            "averageBuyPrice": "669.00",
            "averageSellPrice": "0.00",
            "boardLotQuantity": "1",
            "boughtPrice": "6690.00",
            "buyQuantity": "10",
            "netQuantity": "10",
            "netValue": "-6690.00",
            "positionType": "DAY",
            "sellQuantity": "0",
            "positionConversions": ["CNC", "NRML"],
            "soldValue": "0.00",
            "transactionType": "BUY",
            "realizedGainAndLoss": "0.00",
            "unrealizedGainAndLoss": "0.00",
            "companyName": "INFOSYS LIMITED"
        }
    ]
}
```

### <h3 id="positionConversion">PositionConversion:</h3>

   Convert an existing position of a margin product to a different margin product type. All or a subset of an existing position quantity can be converted to a different product type. The available margin product types are MARGIN_INTRADAY_SQUAREOFF(MIS), CASHNCARRY(CNC), NORMAL(NRML).
       
#### Parameters:

    xSessionToken, exchange, symbolName, transactionType, positionType, quantityToConvert, fromProductType, toProductType, netQuantity
    
#### Sample PositionConversion Request:

```typescript
const positionsApi = new PositionsApi();
const conversionResponse = await positionsApi.convertPosition(xSessionToken, {
  symbolName: "RELIANCE",
  exchange: EXCHANGE_BSE,
  transactionType: TRANSACTION_TYPE_BUY,
  positionType: POSITION_TYPE_DAY,
  quantityToConvert: "2",
  fromProductType: PRODUCT_MIS,
  toProductType: PRODUCT_CNC,
  netQuantity: "2",
});
```

#### Sample PositionConversion Response:

```json
{
    "serverTime": "01/06/20 15:06:42",
    "msgId": "ba32c75f-ee4b-4af6-a580-f17ad36fefd4",
    "status": "Success",
    "statusMsg": "Position Conversion from MIS to CNC successful"
}
```

### <h3 id="positionSquareOff">PositionSquareOff:</h3>

   The PositionsApi class helps the user to Square Off existing position. Mostly used in day trading, in which user buy or sell a particular quantity of a stock and later in the day reverse the transaction to earn a profit.
       
#### Parameters:

    xSessionToken, symbolName, exchange, transactionType, productType, netQuantity
    
#### Sample PositionSquareoff Request:

```typescript
const positionsApi = new PositionsApi();
const squareOffResponse = await positionsApi.squareOffPosition(xSessionToken, {
  positionSquareOffRequestList: [
    {
      exchange: EXCHANGE_BSE,
      symbolName: "TCS",
      productType: PRODUCT_MIS,
      netQuantity: "1",
      transactionType: TRANSACTION_TYPE_BUY,
    },
  ],
});
```

#### Sample PositionSquareOff Response:

```json
{
    "serverTime": "25/06/20 20:04:30",
    "msgId": "fcb519b8-dd74-422a-8a65-1dc0a0caedb7",
    "positionSquareOffResponseList": [
        {
            "status": "Success",
            "statusMessage": "Position square off successful -TCS-EQ NetQty:1"
        }
    ]
}
```

###  <h3 id="holdings">Holdings:</h3>

   Get the details of the Stocks which client is holding. Here, you will be able to get the Client holdings which are bought under 'CNC' product type and are not sold yet.
       
#### Parameters:

    xSessionToken
    
#### Sample Holdings Request:

```typescript
const holdingsApi = new HoldingsApi();
const holding = await holdingsApi.getHolding(xSessionToken);
```

#### Sample Holdings Response:

```json
{
    "serverTime": "25/06/20 13:46:16",
    "msgId": "d58af813-8ed2-400d-b769-9d89f873376d",
    "status": "Success",
    "statusMessage": "User Holding details retrieved successfully",
    "holdingSummary": {
        "gainingTodayCount": "1",
        "losingTodayCount": "2",
        "totalGainAndLossAmount": "-17.15",
        "portfolioValue": "13.40"
    },
    "holdingDetails": [
        {
            "averagePrice": "22.50",
            "exchange": "BSE",
            "lastTradedPrice": "0.00",
            "previousClose": "23.00",
            "productCode": "CNC",
            "symbolDescription": "ASHOK ALCO-CHEM LTD.",
            "tradingSymbol": "ASHOKALC",
            "totalGainAndLoss": "-22.50",
            "holdingsQuantity": "1",
            "collateralQuantity": "-1",
            "holdingsValue": "0.00",
            "sellableQuantity": "0"
        }
    ]
}
```

###  <h3 id="intraDayCandleData">IntraDayCandleData:</h3>

   Gets the Intraday candle data such as Open, high, low, close and volume within specific time period per min for a specific symbol.
      
#### Parameters:

    xSessionToken, exchange, symbolName, fromDate, toDate
    
#### Sample IntraDayCandleData Request:

```typescript
const intraDayCandleDataApi = new IntraDayCandleDataApi();
const intraDayResponse = await intraDayCandleDataApi.getIntradayCandleData(
  xSessionToken, "INFY", "2020-04-27 11:50:00", EXCHANGE_BSE, "2020-04-27 12:29:00"
);
```

#### Sample IntraDayCandleData Response:

```json
{
    "serverTime": "31/05/20 20:46:52",
    "msgId": "ff875ecd-5f42-47f6-a81e-37e6920acefc",
    "intradayCandleData": [
        {
            "dateTime": "2020-04-27 11:50:00.0",
            "open": "632.3",
            "high": "632.3",
            "low": "632.3",
            "close": "632.3",
            "volume": "1"
        }
    ]
}
```

### <h3 id="indexIntraDayCandleData">IndexIntraDayCandleData:</h3>

   Gets the Index intraday candle data such as Open, high, low, close and volume within specific time period per min for a specific index.
      
#### Parameters:

    xSessionToken, indexName, fromDate, toDate
    
#### Sample IndexIntraDayCandleData Request:

```typescript
const intraDayCandleDataApi = new IntraDayCandleDataApi();
const indexIntraDayResponse = await intraDayCandleDataApi.getIndexIntradayCandleData(
  xSessionToken, "NIFTY 200", "2019-08-26 09:07:00", "2019-08-26 09:16:00"
);
```

#### Sample IndexIntraDayCandleData Response:

```json
{
    "serverTime": "02/06/20 18:19:42",
    "msgId": "6e6ad246-9808-4bfc-8cf3-724f4f745113",
    "status": "Success",
    "statusMessage": "Index IntraDay Candle data retrieved successfully ",
    "indexIntraDayCandleData": [
        {
            "dateTime": "2019-08-26 09:07:00.0",
            "open": "5664.2",
            "high": "5664.2",
            "low": "5664.2",
            "close": "5664.2",
            "volume": "0"
        }
    ]
}
```

### <h3 id="historicalCandleData">HistoricalCandleData:</h3>

   Gets the historical candle data such as Open, high, low, close, last traded price and volume within specific dates for a specific symbol. From date is mandatory. End date is optional and defaults to Today.
       
#### Parameters:

    xSessionToken, exchange, symbolName, fromDate, toDate
    
#### Sample HistoricalCandleData Request:

```typescript
const historicalCandleDataApi = new HistoricalCandleDataApi();
const historicalResponse = await historicalCandleDataApi.getHistoricalCandleData(
  xSessionToken, "INFY", "2019-01-01", EXCHANGE_BSE, "2020-02-01"
);
```

#### Sample HistoricalCandleData Response:

```json
{
    "serverTime": "31/05/20 20:18:07",
    "msgId": "07701e56-fb82-4315-bad0-449da8482549",
    "historicalCandleData": [
        {
            "date": "2019-01-01",
            "open": "661.0",
            "high": "667.0",
            "low": "654.3",
            "close": "664.65",
            "ltp": "664.65",
            "volume": "221951"
        }
    ]
}
```

### <h3 id="indexHistoricalCandleData">IndexHistoricalCandleData:</h3>

   Gets the Index historical candle data such as Open, high, low, close, last traded price and volume within specific dates for a specific index. From date is mandatory. End date is optional and defaults to Today.
        
#### Parameters:

    xSessionToken, indexName, fromDate, toDate
    
#### Sample IndexHistoricalCandleData Request:

```typescript
const historicalCandleDataApi = new HistoricalCandleDataApi();
const indexHistoricalResponse = await historicalCandleDataApi.getIndexCandleData(
  xSessionToken, "NIFTY 200", "2015-03-04", "2017-03-05"
);
```

#### Sample IndexHistoricalCandleData Response:

```json
{
    "serverTime": "31/05/20 20:31:02",
    "msgId": "cf232a72-e7d3-42a3-a834-9e8cbd65aa20",
    "status": "Success",
    "statusMessage": "Index HistoricalCandle data retrieved successfully ",
    "indexCandleData": [
        {
            "date": "2015-03-04",
            "open": "4702.2",
            "high": "4706.3",
            "low": "4594.3",
            "close": "4607.4",
            "ltp": "4607.4",
            "volume": "0"
        }
    ]
}
```

### <h3 id="listBasket">ListBasket (v3.2.0):</h3>

Returns the list of saved baskets for the logged-in user.

#### Parameters:

    sessionToken, listType

#### Sample ListBasket Request:
```typescript
import { BasketApi } from "samco-bridge-node";

const basketApi = new BasketApi();
const resp = await basketApi.listBasket(sessionToken, "ALL");
```


### <h3 id="createBasket">CreateBasket (v3.2.0):</h3>

Creates a new basket with a set of order entries that can later be executed atomically.

#### Parameters:

    sessionToken, CreateBasketRequest { basketName, description, orders, newPosition }

#### Sample CreateBasket Request:
```typescript
const resp = await new BasketApi().createBasket(sessionToken, {
  basketName: "MyAlphaBasket",
  description: "Pair-trade leg 1",
  orders: [orderRequest1, orderRequest2],
});
const basketId = resp.basketId;
```


### <h3 id="modifyBasket">ModifyBasket (v3.2.0):</h3>

Updates basket metadata or its constituent orders.

#### Sample ModifyBasket Request:
```typescript
const resp = await new BasketApi().modifyBasket(sessionToken, {
  basketId,
  basketName: "MyAlphaBasket-v2",
  orders: updatedOrderList,
});
```


### <h3 id="deleteBasket">DeleteBasket (v3.2.0):</h3>

Deletes a previously-created basket by id.

#### Sample DeleteBasket Request:
```typescript
const resp = await new BasketApi().deleteBasket(sessionToken, { basketId });
```


### <h3 id="listBasketOrder">ListBasketOrder (v3.2.0):</h3>

Lists the orders inside a basket.

#### Sample ListBasketOrder Request:
```typescript
const resp = await new BasketApi().listBasketOrder(sessionToken, basketId);
```


### <h3 id="createBasketOrder">CreateBasketOrder (v3.2.0):</h3>

Appends a new order to an existing basket.

#### Sample CreateBasketOrder Request:
```typescript
const resp = await new BasketApi().createOrder(sessionToken, {
  basketId,
  orders: [orderRequest],
});
```


### <h3 id="modifyBasketOrder">ModifyBasketOrder (v3.2.0):</h3>

Modifies a single order inside an existing basket.

#### Sample ModifyBasketOrder Request:
```typescript
const resp = await new BasketApi().modifyBasketOrder(sessionToken, {
  basketId,
  orderId,
  orders: [updatedOrderRequest],
});
```


### <h3 id="deleteBasketOrder">DeleteBasketOrder (v3.2.0):</h3>

Removes a specific order from a basket.

#### Sample DeleteBasketOrder Request:
```typescript
const resp = await new BasketApi().deleteBasketOrder(sessionToken, {
  basketId,
  orderId,
});
```


### <h3 id="executeBasket">ExecuteBasketOrder (v3.2.0):</h3>

Executes every order in the basket using its configured `orderType` / `price` / etc.

#### Sample ExecuteBasket Request:
```typescript
const resp = await new BasketApi().executeBasketOrder(sessionToken, {
  basketId,
});
```


### <h3 id="basketSquareOff">BasketSquareOff (v3.2.0):</h3>

Squares off all open positions originating from a basket.

#### Sample BasketSquareOff Request:
```typescript
const resp = await new BasketApi().squareOff(sessionToken, { basketId });
```


### <h3 id="rearrangeBasket">RearrangeBasketOrder (v3.2.0):</h3>

Rearranges (formerly "Modify & Retry") failed/rejected orders within a basket and re-attempts execution.

#### Sample RearrangeBasketOrder Request:
```typescript
const resp = await new BasketApi().rearrangeBasketOrder(sessionToken, {
  basketId,
  orders: retryOrderList,
});
```


### <h3 id="basketSpanCalculator">BasketSpanCalculator (v3.2.0):</h3>

Returns the total SPAN + exposure margin required to execute the basket.

#### Sample BasketSpanCalculator Request:
```typescript
const resp = await new BasketApi().spanCalculator(sessionToken, { basketId });
const { spanMargin, totalMargin } = resp;
```


### <h3 id="analyticsSummary">AnalyticsSummary (v3.2.0):</h3>

High-level analytics summary for the user's portfolio over a duration or explicit date range.

#### Parameters:

    sessionToken, AnalyticsSummaryRequest { duration | fromDate + toDate }

#### Sample AnalyticsSummary Request:
```typescript
import { TradeviewApi } from "samco-bridge-node";

const resp = await new TradeviewApi().analyticsSummary(sessionToken, {
  duration: "1D",   // or set fromDate / toDate
});
```


### <h3 id="analyticsDetails">AnalyticsDetails (v3.2.0):</h3>

Detailed analytics breakdown for the same time window.

#### Sample AnalyticsDetails Request:
```typescript
const resp = await new TradeviewApi().analyticsDetails(sessionToken, {
  fromDate: "2026-01-01",
  toDate: "2026-01-31",
});
```


### <h3 id="gainLoss">GainLoss (v3.2.0):</h3>

Realised / unrealised gain-loss summary for the requested window.

#### Sample GainLoss Request:
```typescript
const resp = await new TradeviewApi().gainLoss(sessionToken, {
  duration: "1M",
});
```


### <h3 id="contractAnalyser">ContractAnalyser (v3.2.0):</h3>

Analyses derivative contracts on a given exchange/expiry date.

#### Parameters:

    sessionToken, ContractAnalyserRequest { exchange, targetDate }

#### Sample ContractAnalyser Request:
```typescript
import { ContractAnalyserApi, EXCHANGE_NFO } from "samco-bridge-node";

const resp = await new ContractAnalyserApi().analyse(sessionToken, {
  exchange: EXCHANGE_NFO,
  targetDate: "2026-02-27",
});
```


### <h3 id="streaming">Streaming (WebSocket — v3.2.0, SDK in v3.2.2):</h3>

Real-time **quote** and **market-depth** streams are exposed over a WebSocket at `wss://stream.samco.in`. The connection authenticates via the `x-session-token` header (the JWT returned by <a href="#sessiontoken">GenerateSessionToken</a>).

A symbol is encoded as `"<listingId>_<exchange>"` (for example `"3045_NSE"`), taken from `ScripMaster.csv`.

Starting in **v3.2.2** the SDK ships a typed `StreamingClient` (built on `ws`) that handles the subscribe / unsubscribe envelope, header-based auth, and dispatch to typed listener callbacks. The Node samples in [`samples/streamingQuote.ts`](./samples/streamingQuote.ts) and [`samples/streamingMarketData.ts`](./samples/streamingMarketData.ts) demonstrate both stream types.

#### Public API:

```typescript
import {
  StreamingClient,
  StreamingListener,
  QuoteTick,
  DepthTick,
  symbolRef,
} from "samco-bridge-node";

// All callbacks are optional — override only the ones you care about.
const listener: StreamingListener = {
  onOpen: () => console.log("open"),
  onQuote: (tick: QuoteTick) => console.log("ltp", tick.symbol, tick.lastTradedPrice),
  onDepth: (tick: DepthTick) => console.log("depth", tick.symbol, tick.bid, tick.ask),
  onMessage: (text) => console.log("raw", text), // frames that don't match a known shape
  onError: (err) => console.error(err),
  onClosed: (code, reason) => console.log("closed", code, reason),
};

const client = new StreamingClient(listener);
await client.connect(sessionToken);                      // wss://stream.samco.in by default

client.subscribeQuote([symbolRef("3045_NSE")]);          // streaming_type=quote
client.subscribeMarketDepth([symbolRef("532826_BSE")]);  // streaming_type=quote2 (5-level depth)

// Always unsubscribe before closing in production code.
client.unsubscribeQuote([symbolRef("3045_NSE")]);
client.close();
```

#### Constructor options:

```typescript
new StreamingClient(listener);                          // default 10s connect timeout
new StreamingClient(listener, { handshakeTimeout: 5000 });  // any ws.ClientOptions
```

`StreamingClient.connect(sessionToken, url?)` returns a `Promise<void>` that resolves once the WebSocket handshake completes; the second argument lets you point at a non-default endpoint (e.g. for testing). To override the default streaming URL globally, call `setStreamingUrl("wss://...")` from `samco-bridge-node` before constructing the client.

#### Tick payload:

`QuoteTick` exposes the well-known fields (`symbol`, `exchange`, `lastTradedPrice`, `openPrice`, `highPrice`, `lowPrice`, `closePrice`, `volume`, `tickTime`) and a `raw: Record<string, unknown>` passthrough for any additional payload fields. `DepthTick` exposes `bid` / `ask` as 5-level arrays plus `raw`.


### <h3 id="logout">Logout:</h3>

   Logging out user from the application
      
#### Parameters:

    xSessionToken
    
#### Sample Logout Request:

```typescript
const logoutApi = new UserLogoutApi();
const logoutResponse = await logoutApi.logout(xSessionToken);
```

#### Sample Logout Response:

```json
{
    "serverTime": "31/05/20 21:27:52",
    "msgId": "41627994-5c96-411c-b15c-dbda00029269",
    "status": "Success",
    "statusMessage": "User has successfully logged out"
}
```
    
 
## Constant List:

   This section contains the list of possible constant values that can be passed for input attributes like exchanges, product types etc.
   
### Product types:
   
    PRODUCT_MIS 
    PRODUCT_CNC
    PRODUCT_NRML
    PRODUCT_CO
    PRODUCT_BO
 
    Example:- { productType: PRODUCT_MIS }
 
### Exchanges:

    EXCHANGE_NSE
    EXCHANGE_BSE
    EXCHANGE_NFO
    EXCHANGE_CDS
    EXCHANGE_MCX
    
    Example:- { exchange: EXCHANGE_BSE }
 
### Transaction types:

    TRANSACTION_TYPE_BUY
    TRANSACTION_TYPE_SELL
    
    Example:- { transactionType: TRANSACTION_TYPE_BUY }
 
### Order types:

    ORDER_TYPE_LIMIT 
    ORDER_TYPE_MARKET
    ORDER_TYPE_SL 
    ORDER_TYPE_SLM
    
    Example:- { orderType: ORDER_TYPE_LIMIT }

### Validity types:

    VALIDITY_DAY 
    VALIDITY_IOC 
    
    Example:- { orderValidity: VALIDITY_DAY }
    
### Position types:

    POSITION_TYPE_DAY
    POSITION_TYPE_NET
    
    Example:- { positionType: POSITION_TYPE_DAY }
