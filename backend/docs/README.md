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

query parameters: none
