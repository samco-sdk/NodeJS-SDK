
# StockNoteBridge - NodeJS SDK for Stocknote API
Official NodeJS SDK for accessing and integrating Stocknote API

This documentation covers details of the NodeJS bridge / SDK provided by SAMCO, for accessing the [SAMCO Stocknote APIs](https://developers.stocknote.com/api/?NodeJS#stocknote-api-documentation).

The primary purpose of this NodeJS Bridge is to help our customers quickly create NodeJS based client scripts using our SDK and integrate with StockNote APIs. Our NodeJS Bridge provides a wrapper over the RESTful StockNote APIs where the HTTP calls have been converted to method calls with JSON responses.

Please refer the below documentation for details on installation, set up and API specific sample code/request-responses to create your own NodeJS client code.

## Installation

This module is installed via npm:

```
npm install stocknotejsbridge
```
Once done, you can verify if package is appropriately installed using  below command.

```
npm list
```

### Prerequisites

NodeJS 5.x or 6.x or above setup. You can verify the version installed using

```
node --version
```

You can verify the npm version installed using
```
npm --version
```

## Getting started with API

### Overview
Stocknote NodeJS SDK is a NodeJS client library for easily accessing the stocknote API. It exposes the individual APIs as NodeJS method calls and provides an easy-to-use interface for implementing your strategies in JS language. 

For specific details on parameters passed on the request, and details about API response, please refer our [Stocknote API documentation](https://developers.stocknote.com/api/?NodeJS#stocknote-api-documentation).

## List Of APIS
<details>
  <summary>Click to expand</summary>
  
* [Login](#login)
* [SearchEquityDerivative](#searchequityderivative)
* [Quote](#quote)
* [IndexQuote](#indexQuote)
* [OptionChain](#optionChain)
* [UserLimits](#userLimits)
* [PlaceOrder](#placeOrder)
* [PlaceOrderBO](#placeOrderBO)
* [PlaceOrderCO](#placeOrderCO)
* [ModifyOrder](#modifyOrder)
* [OrderBook](#orderBook)
* [TriggerOrders](#triggerOrders)
* [OrderStatus](#orderStatus)
* [CancelOrder](#cancelOrder)
* [CancelOrderCO](#cancelOrderCO)
* [CancelOrderBO](#cancelOrderBO)
* [TradeBook](#tradeBook)
* [Positons](#positions)
* [PositionConversion](#positionConversion)
* [PositionSquareOff](#positionSquareOff)
* [Holdings](#holdings)
* [IntraDayCandleData](#intraDayCandleData)
* [IndexIntraDayCandleData](#indexIntraDayCandleData)
* [HistoricalCandleData](#historicalCandleData)
* [IndexHistoricalCandleData](#indexHistoricalCandleData)
* [Logout](#logout)

</details>

## API Promises
```javascript
All API calls returns a promise which you can use to call methods like .then(...) and .catch(...).
stocknoteapijsbridgeAPI()
    .then(function(v) {
        // On success
    })
    .catch(function(e) {
        // On rejected
    });

```
## Using the API

As a first step to access StockNote APIs, you need to import our SDK in your client code and then login to get valid session token.

### Import the NodeJS SDK and get a session token
1. consume  StocknoteAPIJSBridge module
```
var sn = require('stocknoteapijsbridge');
```
2. Login to access Stocknote API by providing below parameters.

<a name="login"/>

## Login

## Parameters:
```
userId,password,yob
```
## Login Sample Request:
    
  <details>
  <summary>Login Sample Request</summary>
  
  ```javascript
var logindata = {
        body: {
            "userId": "******",
            "password": "*******",
            "yob": "****"
        }
    };

    sn.snapi.userLogin(logindata)
    .then((data) => {
        console.log('UserLogin:' + data);
    })
    .catch((error) => {
        console.log(error)
    });
    ##this will return a user details and generated session token
  ```
</details>
 
 <details>
  <summary>Login Response</summary>
  
  ```javascript
	UserLogin:{
	 "serverTime": "29/10/20 12:48:14",
	 "msgId": "d390e2f6-0dd0-443e-a47e-74bb4e254e86",
	 "status": "Success",
	 "statusMessage": "Login session token generated successfully ",
	 "sessionToken": "487e056cafab241ea2c04e3858f46695",
	 "accountID": "DA35672",
	 "accountName": "KALAVALA AVINASH",
	 "exchangeList": [
	  "BSE",
	  "MCX",
	  "CDS",
	  "NSE"
	 ],
	 "orderTypeList": [
	  "L",
	  "MKT",
	  "SL"
	 ],
	 "productList": [
	  "CNC",
	  "CO",
	  "MIS"
	 ]
	}
  ```
</details>

3. Get the session token form login response and set it to `setSessionToken()` function.
```NodeJS
sn.snapi.setSessionToken("f83bb5461751e98e01ca5af451e49e11");
## this function will help to reduce to pass session token for other apis. This will automate the session token for other apis
```

<a name="searchequityderivative"/>

## SearchEquityDerivative:

The search function `search()` should be used to search equity, derivatives and commodity scrips based on user provided search symbol and exchange name. 

#### Parameters:
```javascript
searchSymbolName,exchange
```

<details>
  <summary>Sample Search Request</summary>
  
  ```javascript
    var seareddata = {
    "exchange": sn.constants.EXCHANGE_NFO,
    }
    
   sn.snapi.search("TCS", seareddata)
    .then((data) => {
      console.log('Search:' + data);
    }).catch((error) => {
        console.log(error)
    });
  ```
</details>

<details>
  <summary>Sample Search Response</summary>
  
  ```javascript
	search:{
 "msgId": "a9080992-71f3-47a9-9b53-b6103f4eb6ba",
  "status": "Success",
  "statusMessage": "Equity Search details retrieved successfully",
  "equityDertivativeValues": [
       {
            "tradingSymbol": "BANKNIFTY20JUN21000CE",
            "instrument": "OPTIDX",
            "exchange": "NFO"
        },
        {
            "tradingSymbol": "BANKNIFTY20JUN22000CE",
            "instrument": "OPTIDX",
            "exchange": "NFO"
        },
        {
            "tradingSymbol": "BANKNIFTY20JUN20500CE",
            "instrument": "OPTIDX",
            "exchange": "NFO"
        },
        {
            "tradingSymbol": "BANKNIFTY20JUN20000CE",
            "instrument": "OPTIDX",
            "exchange": "NFO"
        },
        {
            "tradingSymbol": "BANKNIFTY20JUN19000PE",
            "instrument": "OPTIDX",
            "exchange": "NFO"
        },
        {
            "tradingSymbol": "BANKNIFTY20JUN20000PE",
            "instrument": "OPTIDX",
            "exchange": "NFO"
        },
        {
            "tradingSymbol": "BANKNIFTY20JUN21500CE",
            "instrument": "OPTIDX",
            "exchange": "NFO"
        },
        {
            "tradingSymbol": "BANKNIFTY20JUN19500PE",
            "instrument": "OPTIDX",
            "exchange": "NFO"
        }
    ]
}
  ```
</details>


<a name="quote"/>

## Quote

Get market depth details for a specific equity scrip including but not limited to values like last trade price, previous close price, change value, change percentage, bids/asks, upper and lower circuit limits etc. This helps user with market picture of an equity scrip using which he will be able to place an order.
The Quote function name in NodeJS is `getQuotes()`

#### Parameters:
```javascript
symbolName,exchange
```
<details>
  <summary>Sample Quote request</summary>
  
  ```javascript
	var quotedata = {
		"exchange": sn.constants.EXCHANGE_NFO,
	}

	sn.snapi.getQuotes("INFY20NOVFUT",quotedata).then((data) => { console.log('GetQuotes:' + data); }).catch((error) => {console.log(error)});
  ```
</details>

<details>
  <summary>Sample Quote Response</summary>
  
  ```javascript
	GetQuotes:{
	 "serverTime": "29/10/20 13:31:29",
	 "msgId": "688287cf-3818-4620-b5bc-b9c152c1de17",
	 "status": "Success",
	 "statusMessage": "Quote details retrieved successfully",
	 "tradingSymbol": "INFY20NOVFUT",
	 "exchange": "NFO",
	 "lastTradedTime": "NA",
	 "lastTradedPrice": "975.55",
	 "changeValue": "-130.80",
	 "changePercentage": "-11.82",
	 "lastTradedQuantity": "1200",
	 "lowerCircuitLimit": "973.20",
	 "upperCircuitLimit": "1189.45",
	 "averagePrice": "0.00",
	 "totalBuyQuantity": "0",
	 "totalSellQuantity": "0",
	 "totalTradedValue": "NA",
	 "totalTradedVolume": "0",
	 "yearlyHighPrice": "0.00",
	 "yearlyLowPrice": "0.00",
	 "tickSize": "0.05",
	 "openInterest": "23355600",
	 "bestBids": [
	  {
	   "_number": "1",
	   "quantity": "0",
	   "price": "0.00"
	  },
	  {
	   "_number": "2",
	   "quantity": "0",
	   "price": "0.00"
	  },
	  {
	   "_number": "3",
	   "quantity": "0",
	   "price": "0.00"
	  },
	  {
	   "_number": "4",
	   "quantity": "0",
	   "price": "0.00"
	  },
	  {
	   "_number": "5",
	   "quantity": "0",
	   "price": "0.00"
	  }
	 ],
	 "bestAsks": [
	  {
	   "_number": "1",
	   "quantity": "0",
	   "price": "0.00"
	  },
	  {
	   "_number": "2",
	   "quantity": "0",
	   "price": "0.00"
	  },
	  {
	   "_number": "3",
	   "quantity": "0",
	   "price": "0.00"
	  },
	  {
	   "_number": "4",
	   "quantity": "0",
	   "price": "0.00"
	  },
	  {
	   "_number": "5",
	   "quantity": "0",
	   "price": "0.00"
	  }
	 ],
	 "expiryDate": "26 Nov 20",
	 "spotPrice": "1072.80",
	 "instrument": "FUTSTK",
	 "lotQuantity": "1200",
	 "listingId": "47312_NFO",
	 "openInterestChange": "8505600"
	}
  ```
</details>

<a name='indexQuote'/>

## IndexQuote

Getting Index Quote details for a specific Indicies. This helps user with market picture of an specific Index Details.
The IndexQuote function name in NodeJS is `getIndexQuotes()`

#### Parameters:
```javascript
indexName
```
<details>
  <summary>Sample IndexQuote request</summary>
  
  ```javascript
	sn.snapi.getIndexQuotes("SENSEX").then((data) => { console.log('GetIndexQuotes:' + data); }).catch((error) => {console.log(error)});

  ```
</details>

<details>
  <summary>Sample IndexQuote Response</summary>
  
  ```javascript
	GetIndexQuotes:{
    "serverTime": "30/10/20 12:01:09",
    "msgId": "2bdaf06e-f41c-44c5-87aa-4451ca9628bb",
    "status": "Success",
    "statusMessage": "Index Quote details retrieved successfully",
    "indexName": "SENSEX",
    "listingId": "-101",
    "lastTradedTime": "2020-10-30 12:01:08.0",
    "spotPrice": "39401.78",
    "averagePrice": "0.00",
    "openValue": "39779.82",
    "highValue": "39988.25",
    "lowValue": "39326.29",
    "closeValue": "39749.85",
    "totalBuyQuantity": "0",
    "totalSellQuantity": "0",
    "totalTradedVolume": "0"
  }
  ```
</details>

<a name="optionChain"/>

## OptionChain:

The OptionChain function `optionchain()` can be used to search OptionChain for equity, derivatives and commodity scrips based on user provided search symbol and exchange name.

#### Parameters:
```javascript
searchSymbolName,exchange,expiryDate,strikePrice,optionType
```
<details>
  <summary>Sample OptionChain Request</summary>
  
  ```javascript
	var options = {
    "expiryDate": "2020-12-31",
    "optionType": sn.constants.OPTION_TYPE_PE,
    "strikePrice": "1500"
	};
	sn.snapi.optionchain("TCS",options).then((data) => { console.log("OptionChain:" + data); }).catch((error) => { console.error(error) });
  ```
</details>

<details>
  <summary>Sample OptionChain Response</summary>
  
  ```javascript
	OptionChain:{
	 "serverTime": "29/10/20 13:53:32",
	 "msgId": "35bd9041-0aab-49e4-8365-e784c2d1f43c",
	 "status": "Success",
	 "statusMessage": "OptionChain details retrived successfully. ",
	 "optionChainDetails": [
	  {
	   "tradingSymbol": "TCS20DEC1500PE",
	   "exchange": "NFO",
	   "symbol": "85010_NFO",
	   "strikePrice": "1500.00",
	   "expiryDate": "2020-12-31",
	   "instrument": "OPTSTK",
	   "optionType": "PE",
	   "underLyingSymbol": "TCS",
	   "spotPrice": "2645.50",
	   "lastTradedPrice": "0.00",
	   "openInterest": "0",
	   "openInterestChange": "0",
	   "oichangePer": "0",
	   "volume": "0"
	  }
	 ]
	}	
  ```
</details>

<a name="userLimits"/>

## UserLimits

The UserLimits function `userLimits()` can be used  to gets the user cash balances, available margin for trading in equity and commodity segments.

<details>
  <summary>Sample UserLimit Request</summary>
  
  ```javascript
	sn.snapi.userLimits().then((data) => { console.log('userLimits:' + data); }).catch((error) => {console.log(error)});

  ```
</details>

<details>
  <summary>Sample UserLimit Response</summary>
  
  ```javascript
	userLimits:{
	 "serverTime": "29/10/20 14:57:31",
	 "msgId": "f42852ee-1758-4a1f-862e-264ae19d53f9",
	 "status": "Success",
	 "statusMessage": "User Limit details retrieved successfully",
	 "equityLimit": {
	  "grossAvailableMargin": "50000000000",
	  "payInToday": "0",
	  "notionalCash": "0",
	  "marginUsed": "0",
	  "netAvailableMargin": "50000000000"
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
</details>


<a name="placeOrder"/>

## PlaceOrder

The PlaceOrder function `placeOrder()` can be used to place an equity/derivative order to the exchange i.e the place order request typically registers the order with OMS and when it happens successfully, a success response is returned. Successful placement of an order via the API does not imply its successful execution. When an order is successfully placed the PlaceOrder API returns an OrderNumber in response, and the actual order status can be checked separately using the OrderStatus API call .This is for Placing CNC, MIS and NRML Orders.


#### Parameters:
```NodeJS
symbolName,exchange,transactionType,orderType,price,quantity,disclosedQuantity,orderValidity,productType,marketProtection
```

<details>
  <summary>Sample PlaceOrder Request</summary>
  
  ```javascript
	var order = {
		body: {
			"symbolName": "RELIANCE",
			"exchange": sn.constants.EXCHANGE_NSE,
			"transactionType": sn.constants.TRANSACTION_TYPE_BUY,
			"orderType": sn.constants.ORDER_TYPE_LIMIT,
			"price":"1282",
			"quantity": "15",
			"disclosedQuantity": "",
			"orderValidity": sn.constants.VALIDITY_DAY,
			"productType": sn.constants.PRODUCT_MIS,
			"afterMarketOrderFlag": "NO"
		}
	};

	sn.snapi.placeOrder(order).then((data) => { console.log('PlaceOrder:'+ data); }).catch((error) => {console.log(error) });
  ```
</details>


<details>
  <summary>sample PlaceOrder Response</summary>
  
  ```javascript
	{
	  "serverTime": "16/06/20 18:03:48",
	  "msgId": "0b9e75c7-c624-4c77-bfbf-6d4e53536948",
	  "orderNumber": "200616000000350",
	  "status": "Success",
	  "statusMessage": "MIS Order request placed successfully",
	  "exchangeOrderStatus": "PENDING",
	  "orderDetails": {
		"pendingQuantity": "15",
		"avgExecutionPrice": "0.00",
		"orderPlacedBy": "--",
		"tradingSymbol": "RELIANCE-EQ",
		"triggerPrice": "0.00",
		"exchange": "NSE",
		"totalQuantity": "15",
		"transactionType": "BUY",
		"productType": "MIS",
		"orderType": "L",
		"quantity": "15",
		"filledQuantity": "0",
		"orderPrice": "1282.0",
		"filledPrice": "0.00",
		"exchangeOrderNo": "1100000000015551",
		"orderValidity": "DAY",
		"orderTime": "16/06/2020 18:03:47"
	  }
	}

  ```
</details>

<a name="placeOrderBO"/>

## PlaceOrderBO

The PlaceOrderBO function `placeOrderBO()` can be used to place an equity/derivative bracket orders to the exchange i.e the place order BO request typically registers the order with OMS and when it happens successfully, a success response is returned. Successful placement of an order via the API does not imply its successful execution. So when an order is successfully placed the placeOrderBO returns an orderNumber in response, and the actual order status can be checked separately using the orderStatus API call. 

#### Parameters:
```NodeJS
symbolName,exchange,transactionType,orderType,price,quantity,disclosedQuantity,orderValidity,productType,trailingStopLoss,stopLossValue,squareOffValue,valueType,priceType,
```
<details>
  <summary>sample PlaceOrderBO Request</summary>
  
  ```javascript
	var BOorder = {
		body: {
			"symbolName": "TCS",
			"exchange": sn.constants.EXCHANGE_BSE,
			"transactionType": sn.constants.TRANSACTION_TYPE_BUY,
			"orderType": sn.constants.ORDER_TYPE_LIMIT,
			"quantity": "10",
			"disclosedQuantity": "1",
			"price": "2176.10",
			"priceType": "LTP",
			"valueType": "Absolute",
			"orderValidity": sn.constants.VALIDITY_DAY,
			"productType": sn.constants.PRODUCT_BO,
			"squareOffValue": "15.00",
			"stopLossValue": "5.00",
			"trailingStopLoss": "5"
		}
	};
	sn.snapi.placeOrderBO(BOorder).then((data) => { console.log('PlaceOrderBO:' + data); }).catch((error) => {console.log(error)});
  ```
</details>

<details>
  <summary>sample PlaceOrderBO Response</summary>
  
  ```javascript
	PlaceOrderBO:{
	 "serverTime": "29/10/20 15:17:51",
	 "msgId": "16575a0b-4399-4ce6-9c68-d50c1090102c",
	 "orderNumber": "201029000000008",
	 "status": "Success",
	 "exchangeOrderStatus": "PENDING",
	 "statusMessage": "Bracket Order request placed successfully",
	 "orderDetails": {
	  "pendingQuantity": "10",
	  "avgExecutionPrice": "0.00",
	  "tradingSymbol": "TCS",
	  "triggerPrice": "0.00",
	  "exchange": "BSE",
	  "totalQuantity": "10",
	  "transactionType": "BUY",
	  "productType": "BO",
	  "orderType": "L",
	  "quantity": "10",
	  "filledQuantity": "0",
	  "orderPrice": "2176.1",
	  "filledPrice": "0.00",
	  "orderValidity": "DAY",
	  "orderTime": "29/10/2020 15:17:51"
	 }
	}
  ```
</details>


<a name="placeOrderCO"/>

## PlaceOrderCO

The PlaceOrderCO function `placeOrderCO()` can be used to place an equity/derivative CO order to the exchange i.e the place order CO request typically registers the order with OMS and when it happens successfully, a success response is returned. Successful placement of an order via the API does not imply its successful execution. So when an order is successfully placed the placeOrderCO returns an orderNumber in response, and in scenarios as above the actual order status can be checked separately using the orderStatus API call. 

#### Parameters:
```NodeJS
symbolName,exchange,transactionType,orderType,price,quantity,disclosedQuantity,orderValidity,productType,marketProtection,triggerPrice
```
<details>
  <summary>sample PlaceOrderCO Request</summary>
  
  ```javascript
	var COorder = {
		body: {
			"symbolName": "INFY",
			"exchange": sn.constants.EXCHANGE_NSE,
			"transactionType": sn.constants.TRANSACTION_TYPE_BUY,
			"orderType": sn.constants.ORDER_TYPE_LIMIT,
			"price":"679",
			"quantity": "15",
			"disclosedQuantity": "",
			"orderValidity": sn.constants.VALIDITY_DAY,
			"productType": sn.constants.PRODUCT_CO,
			"afterMarketOrderFlag": "No",
			"triggerPrice": "646"

		}
	};

	sn.snapi.placeOrderCO(COorder).then((data) => { console.log('PlaceOrderCO:' + data); }).catch((error) => {console.log(error)});
  ```
</details>

<details>
  <summary>Sample PlaceOrderCO Response</summary>
  
  ```javascript
	{
	  "serverTime": "17/06/20 16:37:18",
	  "msgId": "9bd0ab52-f6a0-4ec6-9813-aa707795aa87",
	  "orderNumber": "200617000000181",
	  "status": "Success",
	  "statusMessage": "CO Order request placed successfully",
	  "exchangeOrderStatus": "EXECUTED",
	  "orderDetails": {
		"pendingQuantity": "0",
		"avgExecutionPrice": "679.00",
		"orderPlacedBy": "--",
		"tradingSymbol": "INFY-EQ",
		"triggerPrice": "646.00",
		"exchange": "NSE",
		"totalQuantity": "15",
		"transactionType": "BUY",
		"productType": "CO",
		"orderType": "L",
		"quantity": "15",
		"filledQuantity": "15",
		"orderPrice": "679.0",
		"filledPrice": "679.00",
		"exchangeOrderNo": "1100000000026975",
		"orderValidity": "DAY",
		"orderTime": "17/06/2020 16:37:17"
	  }
	}
  ```
</details>

<a name="modifyOrder"/>

## ModifyOrder

The ModifyOrder function `modifyOrders()` can be used to modify some attributes of an order as long as it is with open/pending status in system. For modification order identifier is mandatory. With order identifier you need to send the optional parameter(s) which needs to be modified. In case the optional parameters aren't sent, the default will be considered from the original order. Modifiable attributes include quantity, Order Type (L,MKT, SL,SL-M). This API cannot be used for modifying attributes of an executed/rejected/cancelled order. Only the attribute that needs to be modified should be sent in the request alongwith the Order Identifier.

#### Parameters:
```NodeJS
orderType,quantity,disclosedQuantity,orderValidity,price,triggerPrice,orderNumber,marketProtection
```
<details>
  <summary> Sample ModifyOrder Request</summary>
  
  ```javascript
	var modify = {
		body: {
			"quantity": "15",
		}
	};
	sn.snapi.modifyOrders("201029000000008",modify).then((data) => { console.log('ModifyOrder:' + data); }).catch((error) => {console.log(error)});

  ```
</details>

<details>
  <summary>Sample ModifyOrder Response</summary>
  
  ```javascript
	ModifyOrder:{
	 "serverTime": "29/10/20 16:39:48",
	 "msgId": "e9d99a47-5224-42d4-b3f9-cba455d1df57",
	 "orderNumber": "201029000000008",
	 "status": "Success",
	 "statusMessage": "Order 201029000000008 modified successfully",
	 "exchangeOrderStatus": "PENDING",
	 "orderDetails": {
	  "pendingQuantity": "15",
	  "avgExecutionPrice": "0.00",
	  "tradingSymbol": "TCS",
	  "triggerPrice": "0.00",
	  "exchange": "BSE",
	  "totalQuantity": "15",
	  "transactionType": "BUY",
	  "productType": "BO",
	  "orderType": "L",
	  "quantity": "15",
	  "filledQuantity": "0",
	  "orderPrice": "2176.1",
	  "filledPrice": "0.00",
	  "exchangeOrderNo": "1603947830033000087",
	  "orderValidity": "DAY",
	  "orderTime": "29/10/2020 16:39:48"
	 }
	}
  ```
</details>

<a name="orderBook"/>

## OrderBook

The OrderBook function `orderBook()` retrieves and displays details of all orders placed by the user on a specific day. This API returns all states of the orders, namely, open, pending, rejected and executed ones.

<details>
  <summary>Sample OrderBook Request</summary>
  
  ```javascript
	sn.snapi.orderBook().then((data) => { console.log('OrderBook:' + data); }).catch((error) => {console.log(error)});
  ```
</details>

<details>
  <summary>Sample OrderBook Response</summary>
  
  ```javascript
	
	OrderBook:{
	 "serverTime": "29/10/20 16:43:56",
	 "msgId": "19695f39-72ec-488d-a2ff-d366e847edd4",
	 "status": "Success",
	 "statusMessage": "Order Book details retrieved successfully",
	 "orderBookDetails": [
	  {
	   "orderNumber": "201029000000008",
	   "exchange": "BSE",
	   "tradingSymbol": "TCS",
	   "transactionType": "BUY",
	   "productCode": "BO",
	   "orderType": "L",
	   "orderPrice": "2176.10",
	   "triggerPrice": "0.00",
	   "orderValidity": "DAY",
	   "orderStatus": "Open",
	   "orderValue": "0.0",
	   "orderTime": "29-Oct-2020 15:17:51",
	   "userId": "DA35672",
	   "filledQuantity": "0",
	   "fillPrice": "0.00",
	   "averagePrice": "0.00",
	   "rejectionReason": "--",
	   "exchangeConfirmationTime": "29-Oct-2020 16:43:44",
	   "coverOrderPercentage": "0.0",
	   "orderRemarks": "--",
	   "exchangeOrderNumber": "1603947830033000087",
	   "symbol": "532540_BSE",
	   "status": "Open",
	   "exchangeStatus": "open",
	   "expiry": "NA",
	   "pendingQuantity": "15",
	   "totalQuanity": "15",
	   "orderPlaceBy": "DA35672",
	   "displayStrikePrice": "00.00",
	   "displayNetQuantity": "15"
	  }
	 }
  ```
</details>


<a name="triggerOrders"/>

## TriggerOrders

The TriggerOrders function `getTriggerOrder()` is used to get the trigger order numbers in case of BO and CO orders so that their attribute values can be modified for BO orders. It will give the order identifiers for Stop loss leg and target leg. Similarly for CO orders, it will return order identifier of stop loss leg only. Using the order identifier, the user would be able to modify the order attributes using the modifyOrder API. Refer modifyOrder API documentation for the parameters details.

#### Parameters:
```NodeJS
orderNumber
```
<details>
  <summary>Sample TriggerOrders Request</summary>
  
  ```javascript
	sn.snapi.getTriggerOrder("200617000000380").then((data) => { console.log('getTriggerOrder:' + data); }).catch((error) => {console.log(error)});
	
  ```
</details>

<details>
  <summary>Sample TriggerOrders Response</summary>
  
  ```javascript
	{
		"serverTime": "17/06/20 18:40:00",
		"msgId": "ccff75e1-9d79-4b54-b4cb-bc48e080758f",
		"status": "Success",
		"statusMessage": "SubOrder details retrieved successfully.",
		"triggerOrders": [
			{
				"targetOrderNo": "200617000000380",
				"orderStatus": "Complete",
				"orderPrice": "2010.00",
				"triggerPrice": "0.00"         
			},
			{
				"targetOrderNo": "200617000000379",
				"orderStatus": "Cancelled",
				"orderPrice": "2029.95",
				"triggerPrice": "0.00"
			}
		]
	}
	
  ```
</details>

<a name="orderStatus"/>

## OrderStatus

The OrderStatus function `orderStatus` is used to get status of an order placed previously. This API returns all states of the orders,but not limited to open, pending, and partially filled ones.

#### Parameters:
```NodeJS
orderNumber
```
#### Sample OrderStatus Request:

<details>
  <summary>Sample OrderStatus Request</summary>
  
  ```javascript
	sn.snapi.orderStatus("201029000000008").then((data) => { console.log('OrderStatus:' + data); }).catch((error) => {console.log(error)});
	
  ```
</details>


<details>
  <summary>Sample OrderStatus Response</summary>
  
  ```javascript
	{
		"serverTime": "17/06/20 20:54:53",
		"msgId": "d45688d9-31c0-4195-90ba-5474e7f50873",
		"orderNumber": "200617000000378",
		"orderStatus": "EXECUTED",
		"orderDetails": {
			"pendingQuantity": "0",
			"avgExecutionPrice": "2014.95",
			"orderPlacedBy": "--",
			"tradingSymbol": "TCS",
			"triggerPrice": "0.00",
			"exchange": "BSE",
			"totalQuantity": "10",
			"transactionType": "BUY",
			"productType": "BO",
			"orderType": "L",
			"quantity": "10",
			"filledQuantity": "10",
			"orderPrice": "2021.0",
			"filledPrice": "2014.95",
			"exchangeOrderNo": "1592387449638000143",
			"orderValidity": "DAY",
			"orderTime": "17/06/2020 18:38:37"
		}
	}
	
  ```
</details>


<a name="cancelOrder"/>

## CancelOrder:

The CancleOrder function `cancelOrders()` is used to cancel an order which is in open or pending status in system. In other words, cancellation cannot be initiated for already Executed, Rejected orders.This is for CNC, MIS and NRML Orders.

#### Parameters:
```NodeJS
orderNumber
```
<details>
  <summary>Sample CancelOrder Request</summary>
  
  ```javascript
sn.snapi.cancelOrders("200616000000350").then((data) => { console.log('cancelOrder:' + data); }).catch((error) => {console.log(error)});
  ```
</details>

<details>
  <summary>sample CancelOrder Response</summary>
  
  ```javascript
	{
	  "serverTime" : "16/06/20 14:50:36",
	  "msgId" : "25d6d99b-3224-4a77-b129-a5d0bd38349b",
	  "status" : "Success",
	  "orderNumber" : "200616000000350",
	  "statusMessage" : "Order cancelled successfully"
	}
  ```
</details>

<a name="cancelOrderCO"/>

## CancelOrderCO

The CancleOrderCO function `cancelCOOrder()` is used for Cancellation/exit of CO orders by passing main leg Order number. 

If main leg is in Open/Pending state that order will be cancelled.
If the main leg is executed and the sublegs are created and in open/Trigger pending state, the order will be exited.
If the main leg is executed and if Stop loss is hit, API will return error message "SubOrder is in Executed status. Cannot exit/cancel such orders.

#### Parameters:
```javascript
orderNumber
```
<details>
  <summary>sample CancelOrderCO Request</summary>
  
  ```javascript
	sn.snapi.cancelCOOrder("200617000000181").then((data) => { console.log('cancelCOOrder:' + data); }).catch((error) => {console.log(error)});
  ```
</details>

<details>
  <summary>sample CancelOrderCO Response</summary>
  
  ```javascript
	{
	  "serverTime" : "16/06/20 14:50:36",
	  "msgId" : "25d6d99b-3224-4a77-b129-a5d0bd38349b",
	  "status" : "Success",
	  "orderNumber" : "200617000000181",
	  "statusMessage" : "Cover Order 200617000000181 exited successfully"
	}
  ```
</details>

<a name="cancelOrderBO"/>

## CancelOrderBO

The CancleOrderBO function `cancelBOOrder()` is used for Cancellation/exit of BO orders pass main leg Order number. 
If main leg is in Open/Pending state that order will be cancelled.
If the main leg is executed and the sublegs are created and in open/Trigger pending state, the order will be exited.
If the main leg is executed and if either of Stop loss or target is hit, API will return error message "SubOrder is in Executed status. Cannot exit/cancel such orders.

#### Parameters:
```NodeJS
orderNumber
```

<details>
  <summary>sample CancelOrderBO Request</summary>
  
  ```javascript
sn.snapi.cancelBOOrder("200617000000375").then((data) => { console.log('cancelBOOrder:' + data); }).catch((error) => {console.log(error)});

  ```
</details>

<details>
  <summary>sample CancelOrderBO Response</summary>
  
  ```javascript
	{
	  "serverTime" : "16/06/20 14:50:36",
	  "msgId" : "25d6d99b-3224-4a77-b129-a5d0bd38349b",
	  "status" : "Success",
	  "orderNumber" : "200617000000375",
	  "statusMessage" : "Bracket Order exited successfully"
	}
  ```
</details>


<a name="tradeBook"/>

## TradeBook

The TradeBook function is `tradeBook()`which gives details of all successfully executed orders placed by the user.

<details>
  <summary>Sample TradeBook Request</summary>
  
  ```javascript

sn.snapi.tradeBook().then((data) => { console.log('TradeBook:' + data); }).catch((error) => { console.log(error) });

  ```
</details>

<details>
  <summary> Sample TradeBook Response</summary>
  
  ```javascript
	{
		"serverTime": "17/06/20 21:01:25",
		"msgId": "c4b7ec88-32e5-4e1f-a56b-7186f6933d79",
		"status": "Success",
		"statusMessage": "Request Successfull",
		"tradeBookDetails": [
			{
				"orderNumber": "200617000000380",
				"exchange": "BSE",
				"tradingSymbol": "TCS",
				"transactionType": "SELL",
				"productCode": "BO",
				"orderType": "L",
				"orderPrice": "2010.00",
				"quantity": "10",
				"orderValidity": "DAY",
				"orderTime": "06:39:50 PM",
				"filledQuantity": "10",
				"exchangeOrderNumber": "1592387449638000145",
				"tradeNumber": "25400",
				"tradePrice": "2010.00",
				"tradeDate": "17JUN2020",
				"tradeTime": "06:39:49 PM",
				"strikePrice": "0.00",
				"optionType": "XX",
				"expiry": "NA"
			}
		]
	}
  ```
</details>
<a name="positions"/>

## Positions

The Postions function `userPostions()` gets the position details of the user (The details of equity, derivative, commodity, currency borrowed or owned by the user).

#### Parameters:
```NodeJS
positiontype
```
<details>
  <summary>Sample Positions Request</summary>
  
  ```javascript
sn.snapi.userPostions("DAY").then((data) => { console.log("UserPositions:" + data); }).catch((error) => { console.error(error) });
  ```
</details>

<details>
  <summary>Sample Positions Response</summary>
  
  ```javascript
{
    "serverTime": "17/06/20 21:06:10",
    "msgId": "36a2cb48-2ce8-48e4-ac0a-90e68c6d26f1",
    "status": "Success",
    "statusMessage": "User Positions details retrieved successfully",
    "positionDetails": [
        {
            "averagePrice": "-4.95",
            "exchange": "BSE",
            "markToMarketPrice": "-99.00",
            "lastTradedPrice": "2,010.00",
            "previousClose": "2067.80",
            "productCode": "BO",
            "tradingSymbol": "TCS",
            "calculatedNetQuantity": "0.0",
            "averageBuyPrice": "2014.95",
            "averageSellPrice": "2010.00",
            "boardLotQuantity": "1",
            "boughtPrice": "40299.00",
            "buyQuantity": "20",
            "carryForwardQuantity": "0",
            "carryForwardValue": "0.00",
            "multiplier": "1",
            "netPositionValue": "-99.00",
            "netQuantity": "0",
            "netValue": "-99.00",
            "positionType": "DAY",
            "positionConversions": [
                "CNC",
                "NRML"
            ],
            "soldValue": "40200.00",
            "transactionType": "BUY",
            "realizedGainAndLoss": "-99.00",
            "unrealizedGainAndLoss": "0.00",
            "companyName": "TATA CONSULTANCY SERVICES LTD."
        }
    ]
}
  ```
</details>

<a name="positionConversion"/>

## PositionConversion

The PostionConversion function `postionConversion()` is used to convert an existing position of a margin product to a different margin product type. All or a subset of an existing position quantity can be converted to a different product type.The available margin product types are MARGIN_INTRADAY_SQUAREOFF(MIS), CASHNCARRY(CNC), NORMAL(NRML).

#### Parameters:
```javascript
symbolName,exchange,transactionType,positionType,quantityToConvert,fromProductType,toProductType,netQuantity
```

<details>
  <summary>Sample PositionConverstion Request</summary>
  
  ```javascript
var conversion = {
    body: {
        "symbolName": "TCS",
        "exchange": sn.constants.EXCHANGE_BSE,
        "transactionType": sn.constants.TRANSACTION_TYPE_BUY,
        "positionType": sn.constants.VALIDITY_DAY,
        "quantityToConvert": "2",
        "fromProductType": sn.constants.PRODUCT_MIS,
        "toProductType": sn.constants.PRODUCT_CNC,
        "netQuantity": "2"
    }
};

sn.snapi.postionConversion(conversion).then((data) => { console.log("postionConversion:" + data); }).catch((error) => { console.error(error) });
  ```
</details>

<details>
  <summary>Sample PostionConverstion Response</summary>
  
  ```javascript

  {
  "serverTime" : "17x/06/20 15:06:42",
  "msgId" : "ba32c75f-ee4b-4af6-a580-f17ad36fefd4",
  "status" : "Success",
  "statusMsg" : "Position Conversion from MIS to CNC successful"
}
  ```
</details>

<a name="positionSquareOff"/>

## PositionSquareOff

The PositionSquareoff function `positonSquareoff()` helps the user to SqareOff existing position. Mostly used in day trading, in which user buy or sell a particular quantity of a stock and later in the day reverse the transaction to earn a profit. 

#### Parameters:
```javascript
symbolName,exchange,transactionType,productType,netQuantity
```
<details>
  <summary>Sample PositionSquareoff Request</summary>
  
  ```javascript
var squareOff = {
    body: {
        "exchange": sn.constants.EXCHANGE_NSE,
        "symbolName":"TCS",
        "productType":sn.constants.PRODUCT_MIS,
        "netQuantity":"1",
        "transactionType":sn.constants.TRANSACTION_TYPE_BUY
    }
};

sn.snapi.positonSquareoff(squareOff).then((data) => { console.log("postionSquareoff:" + data); }).catch((error) => { console.error(error) });
  ```
</details>

<details>
  <summary>Sample PositionSquareoff Response</summary>
  
  ```javascript
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
</details>

<a name="holdings"/>

## Holdings

The Holdings function `holdings()` helps the user to get the details of the Stocks which client is holding. Here, you will be able to get the Client holdings which are bought under ‘CNC’ product type and are not sold yet.

<details>
  <summary>Sample Holdings Request</summary>
  
  ```javascript
sn.snapi.holdings().then((data) => { console.log("GetHoldings:" + data); }).catch((error) => { console.error(error) });
  ```
</details>

<details>
  <summary>Sample Holdings Response</summary>
  
  ```javascript
{
    "serverTime": "16/06/20 18:31:52",
    "msgId": "192d039e-6647-4e2f-8d97-5a91143d47a7",
    "status": "Success",
    "statusMessage": "User Holding details retrieved successfully",
    "holdingSummary": {
        "gainingTodayCount": "2",
        "losingTodayCount": "2",
        "totalGainAndLossAmount": "-242900000.00",
        "portfolioValue": "176205000.00"
    },
    "holdingDetails": [
        {
            "averagePrice": "51.10",
            "exchange": "BSE",
            "lastTradedPrice": "0.00",
            "previousClose": "51.10",
            "productCode": "CNC",
            "symbolDescription": "ASHOK LEYLAND LTD.",
            "tradingSymbol": "ASHOKLEY",
            "totalGainAndLoss": "-51100000.00",
            "holdingsQuantity": "1000000",
            "collateralQuantity": "0",
            "holdingsValue": "0.00",
            "sellableQuantity": "1000000"
        },
        {
            "averagePrice": "1610.60",
            "exchange": "NSE",
            "lastTradedPrice": "1760.30",
            "previousClose": "1610.60",
            "productCode": "CNC",
            "symbolDescription": "ASIAN PAINTS LIMITED",
            "tradingSymbol": "ASIANPAINT-EQ",
            "totalGainAndLoss": "14970000.00",
            "holdingsQuantity": "100000",
            "collateralQuantity": "0",
            "holdingsValue": "176030000.00",
            "sellableQuantity": "100000"
        },
        {
            "averagePrice": "1.65",
            "exchange": "NSE",
            "lastTradedPrice": "1.75",
            "previousClose": "1.65",
            "productCode": "CNC",
            "symbolDescription": "JAIPRAKASH ASSOCIATES LTD",
            "tradingSymbol": "JPASSOCIAT-EQ",
            "totalGainAndLoss": "10000.00",
            "holdingsQuantity": "100000",
            "collateralQuantity": "0",
            "holdingsValue": "175000.00",
            "sellableQuantity": "100000"
        },
        {
            "averagePrice": "2067.80",
            "exchange": "BSE",
            "lastTradedPrice": "0.00",
            "previousClose": "2067.80",
            "productCode": "CNC",
            "symbolDescription": "TATA CONSULTANCY SERVICES LTD.",
            "tradingSymbol": "TCS",
            "totalGainAndLoss": "-206780000.00",
            "holdingsQuantity": "100000",
            "collateralQuantity": "0",
            "holdingsValue": "0.00",
            "sellableQuantity": "100000"
        }
    ]
}
  ```
</details>

<a name="intraDayCandleData"/>

## IntraDayCandleData

The IndexIntraDayCandleData function `intradayCandleData()` gets the Intraday candle data such as Open, high, low, close and volume within specific time period.

#### Parameters:
```NodeJS
symbolName,exchange,fromDate,toDate, interval
```
<details>
  <summary>Sample IntraDayCandleData Request</summary>
  
  ```javascript
var candle = {
    "exchange": sn.constants.EXCHANGE_NSE,
    "interval": sn.constants.INTERVAL_60MIN,
    "toDate": "2020-06-17 10:28:00"
};

sn.snapi.intradayCandleData("INFY","2020-06-17 10:22:00",candle).then((data) => { console.log("intradayCandleData:" + data); }).catch((error) => { console.error(error) });
 ```
</details>

<details>
  <summary>Sample IntraDayCandleData Response</summary>
  
  ```javascript
{
  "serverTime": "17/06/20 10:50:31",
  "msgId": "c3a1ae34-8078-4f56-8a00-83f92bfa3a4b",
  "status": "Success",
  "statusMessage": "Intraday candle data retrieved successfully",
  "intradayCandleData": [
    {
      "dateTime": "2020-06-17 10:22:00.0",
      "open": "705.25",
      "high": "705.3",
      "low": "704.6",
      "close": "704.65",
      "volume": "7627"
    },
    {
      "dateTime": "2020-06-17 10:23:00.0",
      "open": "704.6",
      "high": "704.7",
      "low": "704.0",
      "close": "704.0",
      "volume": "16154"
    },
    {
      "dateTime": "2020-06-17 10:24:00.0",
      "open": "704.25",
      "high": "704.6",
      "low": "704.05",
      "close": "704.6",
      "volume": "13767"
    },
    {
      "dateTime": "2020-06-17 10:25:00.0",
      "open": "704.75",
      "high": "704.75",
      "low": "703.8",
      "close": "703.95",
      "volume": "13091"
    },
    {
      "dateTime": "2020-06-17 10:26:00.0",
      "open": "703.95",
      "high": "704.3",
      "low": "703.8",
      "close": "704.1",
      "volume": "7039"
    },
    {
      "dateTime": "2020-06-17 10:27:00.0",
      "open": "704.15",
      "high": "704.15",
      "low": "703.55",
      "close": "703.95",
      "volume": "17886"
    },
    {
      "dateTime": "2020-06-17 10:28:00.0",
      "open": "704.0",
      "high": "704.95",
      "low": "703.75",
      "close": "704.85",
      "volume": "17760"
    }
  ]
}
  ```
</details>

<a name="indexIntraDayCandleData"/>

### IndexIntraDayCandleData

The IndexIntraDayCandleData function `indexIntradayCandleData()` gets the Index intraday candle data such as Open, high, low, close and volume within specific time period.

#### Parameters:
```javascript
indexName,fromDate,toDate,interval
```
<details>
  <summary>Sample IndexIntraDayCandleData Request</summary>
  
  ```javascript
var indexData = {
    "interval":  sn.constants.INTERVAL_60MIN,
    "toDate": "2020-06-16 9:28:00"
};

sn.snapi.indexIntradayCandleData("sensex","2020-06-16 09:23:00",indexData).then((data) => { console.log("intradayCandleData:" + data); }).catch((error) => { console.error(error) });
  ```
</details>

<details>
  <summary>Sample IndexIntraDayCandleData Response</summary>
  
  ```javascript
  {
  "serverTime": "16/06/20 19:09:13",
  "msgId": "42bc5657-2d2b-49f3-8ead-1bb07a157e2a",
  "status": "Success",
  "statusMessage": "Index IntraDay Candle data retrieved successfully ",
  "indexIntraDayCandleData": [
    {
      "dateTime": "2020-06-16 09:23:00.0",
      "open": "33896.83",
      "high": "33914.65",
      "low": "33874.05",
      "close": "33874.96",
      "volume": "0"
    },
    {
      "dateTime": "2020-06-16 09:24:00.0",
      "open": "33878.08",
      "high": "33915.78",
      "low": "33874.27",
      "close": "33909.3",
      "volume": "0"
    },
    {
      "dateTime": "2020-06-16 09:25:00.0",
      "open": "33905.3",
      "high": "33911.31",
      "low": "33884.92",
      "close": "33900.15",
      "volume": "0"
    },
    {
      "dateTime": "2020-06-16 09:26:00.0",
      "open": "33899.02",
      "high": "33936.46",
      "low": "33899.02",
      "close": "33936.46",
      "volume": "0"
    },
    {
      "dateTime": "2020-06-16 09:27:00.0",
      "open": "33936.5",
      "high": "33951.67",
      "low": "33924.21",
      "close": "33925.92",
      "volume": "0"
    },
    {
      "dateTime": "2020-06-16 09:28:00.0",
      "open": "33925.2",
      "high": "33928.91",
      "low": "33886.56",
      "close": "33890.5",
      "volume": "0"
    }
  ]
}
  ```
</details>

<a name="historicalCandleData"/>

## HistoricalCandleData:

The HistoricalCandleData function `historicalCandleData()` gets the historical candle data such as Open, high, low, close, last traded price and volume within specific dates for a specific symbol. From date is mandatory. End date is optional and defaults to Today.

#### Parameters:
```NodeJS
symbolName,exchange,fromDate,toDate
```
<details>
  <summary>Sample HistoricalCandleData Request</summary>
  
  ```javascript

var historycandle = {
    "exchange": sn.constants.EXCHANGE_NFO,
    "toDate": "2020-06-17"
};

sn.snapi.historicalCandleData("BANKNIFTY18JUN2018500PE","2020-06-14",historycandle).then((data) => { console.log("historicalCandleData:" + data); }).catch((error) => { console.error(error) });

  ```
</details>

<details>
  <summary>Sample HistoricalCandleData respone</summary>
  
  ```javascript
{
  "serverTime": "17/06/20 11:14:06",
  "msgId": "97cdca8f-81f9-4a88-8da6-99b471e82803",
  "status": "Success",
  "statusMessage": "Historical candle data retrieved successfully",
  "historicalCandleData": [
    {
      "date": "2020-06-15",
      "open": "60.0",
      "high": "136.45",
      "low": "56.2",
      "close": "78.5",
      "ltp": "78.5",
      "volume": "9302660"
    },
    {
      "date": "2020-06-16",
      "open": "38.75",
      "high": "206.85",
      "low": "13.0",
      "close": "38.5",
      "ltp": "38.5",
      "volume": "7792900"
    }
  ]
}
  ```
</details>

<a name="indexHistoricalCandleData"/>

### IndexHistoricalCandleData:
The IndexHistoricalCandleData function `indexHistoricalCandleData()` gets the Index historical candle data such as Open, high, low, close, last traded price and volume within specific dates for a specific index. From date is mandatory. End date is optional and defaults to Today.

#### Parameters:
```javascript
indexName,fromDate,toDate
```
<details>
  <summary>Sample IndexHistoricalCandleData Request</summary>
  
  ```javascript
var indexCandle = {
    "toDate": "2020-10-22"
};

sn.snapi.indexHistoricalCandleData("SENSEX","2020-10-21",indexCandle).then((data) => { console.log("IndexHistoricalCandleData:" + data); }).catch((error) => { console.error(error) });
  ```
</details>

<details>
  <summary>Sample IndexHistoricalCandleData Response</summary>
  
  ```javascript
{
  "serverTime": "17/06/20 11:39:11",
  "msgId": "bb015c56-74e5-401b-bfe0-e2c9c415d088",
  "status": "Success",
  "statusMessage": "Index HistoricalCandle data retrieved successfully ",
  "indexCandleData": [
    {
      "date": "2019-05-24",
      "open": "6067.65",
      "high": "6134.4",
      "low": "6029.9",
      "close": "6129.8",
      "ltp": "6129.8",
      "volume": "0"
    },
    {
      "date": "2019-05-27",
      "open": "6134.35",
      "high": "6189.0",
      "low": "6114.5",
      "close": "6177.15",
      "ltp": "6177.15",
      "volume": "0"
    },
    {
      "date": "2019-05-28",
      "open": "6195.7",
      "high": "6195.7",
      "low": "6151.25",
      "close": "6181.35",
      "ltp": "6181.35",
      "volume": "0"
    },
    {
      "date": "2019-05-29",
      "open": "6172.55",
      "high": "6178.85",
      "low": "6132.0",
      "close": "6143.8",
      "ltp": "6143.8",
      "volume": "0"
    }
  ]
}
  ```
</details>

<a name="logout"/>

## Logout
Logging out user from the application.
The Logout function name in NodeJS is `userLogout()`

<details>
  <summary>Sample Logout Request</summary>
  
  ```javascript
sn.snapi.userLogout().then((data) => { console.log('LOGOUT:' + data); }).catch((error) => {console.log(error)});
  ```
</details>

<details>
  <summary>Sample Logout Response</summary>
  
  ```javascript
{
  "serverTime" : "17/06/20 12:27:52",
  "msgId" : "41627994-5c96-411c-b15c-dbda00029269",
  "status" : "Success",
  "statusMessage" : "User has successfully logged out"
}
  ```
</details>


## Constant List:
This section contains the list of possible constant values that can be passed for input attributes like exchanges, product types etc.

<details>
  <summary>Product types</summary>
  
 	PRODUCT_MIS 
    PRODUCT_CNC
    PRODUCT_NRML
    PRODUCT_CO
    PRODUCT_BO
   
    Example:- "productType":sn.constants.PRODUCT_MIS
</details>
   
<details>
  <summary>Exchanges</summary>

    EXCHANGE_NSE
    EXCHANGE_BSE
    EXCHANGE_NFO
    EXCHANGE_CDS
    EXCHANGE_MCX
   
    Example:- "exchange":sn.constants.EXCHANGE_NFO
</details>

<details>
  <summary>Transaction types</summary>

    TRANSACTION_TYPE_BUY
    TRANSACTION_TYPE_SELL
   
    Example:- "transactionType":sn.constants.TRANSACTION_TYPE_BUY
</details>
   
<details>
  <summary>Order types</summary>
  
    ORDER_TYPE_MARKET
    ORDER_TYPE_LIMIT 
    ORDER_TYPE_SLM 
    ORDER_TYPE_SL 
   
    Example:- "orderType": sn.constants.ORDER_TYPE_LIMIT
</details>  

<details>
  <summary>Validity types</summary> 
   
    VALIDITY_DAY 
    VALIDITY_IOC 
 
    Example:- "orderValidity": sn.constants.VALIDITY_DAY
</details>

<details>
  <summary>Position types</summary>
   
    POSITION_TYPE_DAY
    POSITION_TYPE_NET
 
    Example:- "position_type": sn.constants.POSITION_TYPE_DAY
</details>

<details>
  <summary>Intervals</summary>

    INTERVAL_1MIN
    INTERVAL_5MIN 
    INTERVAL_10MIN
    INTERVAL_15MIN
    INTERVAL_30MIN
    INTERVAL_60MIN
    Example:- "interval": sn.constants.INTERVAL_10MIN
</details>
