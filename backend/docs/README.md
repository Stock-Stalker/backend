# StockStalker - API

> The API powering StockStalker

## Getting Started

Base url: ```stockstalker.tk/api```

### Searching for Stocks

**Request**:

url: "/stock/:symbol"

Where :symbol refers to the unique ticker symbol for a given stock.

> Ex: AAPL for Apple

Can also accept the company name, case insensitive.

> Ex: Apple, ApPle, apple, or APPLE

The company name or symbol sent in the query parameters will be validated.

**Response**

Success status code: 200

Successful responses will return ```stockData```. An example response:

```json
{
  "stockData": {
    "symbol": "AAPL",
    "companyName":
    {
      "companyName":"Apple Inc. - Common Stock"
    },
      "historicalData":
      [{
        "datetime": "2021-03-16",
        "open":"125.70000",
        "high":"127.22000",
        "low":"124.71500",
        "close":"125.57000",
        "volume":"114813750"
        },
        {
          "datetime":"2021-03-15",
          "open":"121.41000",
          "high":"124.00000",
          "low":"120.43000",
          "close":"123.99000",
          "volume":"92590555"
          }
        ... ]
      }
}
```

Error status code: 404

An unsuccessful validation (for example, inserting a company name that doesn't exist) will return a 404 status code for "resource not found". An example error response:

```json
{
  "message":	"Cannot Find The Company or Symbol"
}
```
