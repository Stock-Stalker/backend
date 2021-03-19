# StockStalker - API

> The API powering StockStalker

## Getting Started

Base url: ```stockstalker.tk/api```

### Get All Stocks

**Request**:

url: "/stocks"

method: GET

**Response**:

Success status code: 200

This route returns all names and symbols of the NASDAQ and DOW companies currently supported by StockStalker.

Example response:

```json
[
  {
    "symbol": "AACG",
    "companyName": "ATA Creativity Global - American Depositary Shares, each representing two common shares"
  },
  {
    "symbol": "AACQ",
    "companyName": "Artius Acquisition Inc. - Class A Common Stock"
  },
  ...
]
```

Types:

- symbol: String
- companyName: String

Error status code: 500

An unsuccessful request, for any reason (such as the database connection times out, or there's another server-side issue) will result in an error response:

```json
{
  "message": "Connection refused."
}
```

### Searching for Stocks

**Request**:

url: "/stocks/:symbol"

method: GET

Where :symbol refers to the unique ticker symbol for a given stock.

> Ex: AAPL for Apple

Can also accept the company name, case insensitive.

> Ex: Apple, ApPle, apple, or APPLE

The company name or symbol sent in the query parameters will be validated.

**Response**:

Success status code: 200

Successful responses will return ```stockData```. An example response:

```json
{
  "stockData": {
    "symbol": "AAPL",
    "companyName":"Apple Inc. - Common Stock",
    "historicalData": [{
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
}
```

Types:

- stockData: Object
  - symbol: String
  - companyName: String
  - historicalData: List of objects
    - datetime: String
    - open: String
    - high: String
    - low: String
    - close: String
    - volume: String

Error status code: 404

An unsuccessful validation (for example, inserting a company name that doesn't exist) will return a 404 status code for "resource not found". An example error response:

```json
{
  "message":	"Cannot Find The Company or Symbol"
}
```

## Users

Users are able to make accounts with StockStalker to track their own watchlist. This enables users to quickly access the stocks that matter to them.

### Signing Up Users

**Request**:

url: "/user/signup"

method: POST

The request expects in the body a *username* and *password*.

Username must be between *4 and 25* characters long.

Password must be between *8 and 25* characters long.

Example request body:

```json
{
  "username": "newuser",
  "password": "password"
}
```

Types:

- username: String
- password: String

**Response**:

Success status code: 200

A successful response will send a Bearer token to be set in the Authorization header.
This header will be evaluated for all restricted routes.

Example Authorization header for your reference:

```js
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZBS0VVU0VSIiwidXNlcklkIjoiNjA1M2JlZTg5YzU3MTcwMTQyMDExYzM2IiwiaWF0IjoxNjE2MTAxMTIzLCJleHAiOjE2MTYxMDQ3MjN9.IzWXlrFS7mQqR652keVEHnR4ayspk5yyyMjRpYTY7gw'
}
```

The response will send a success message and your new user's username.

Example response:

```json
{
  "message": "Sign up successful!",
  "user": {
    "username": "newuser"
  },
  "token":
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZBS0VVU0VSIiwidXNlcklkIjoiNjA1M2JlZTg5YzU3MTcwMTQyMDExYzM2IiwiaWF0IjoxNjE2MTAxMTIzLCJleHAiOjE2MTYxMDQ3MjN9.IzWXlrFS7mQqR652keVEHnR4ayspk5yyyMjRpYTY7gw"
}
```

Types:

- message: String
- user: Object
  - username: String
- token: String

Validation error status code: 422

In the event that the request body cannot be validated, a status code of 422 will be returned, along with an error message containing something similar to (for example):

```json
"ValidationError": "Username must be more than 4 characters"
```

Error status code: 409

In the event that the username you are attempting to sign up with already exists, a status code of 409 will be returned, along with a message stating that the user already exists.

Example 409 error message:

```json
{
  "message": "User already exists!"
}
```

Error status code: 500

In the event that there is another error due to a failure on the server side, a status code of 500 will be returned, along with a message stating the error.

Example 500 error message:

```json
{
  "err": "[error] 29#29: *17 upstream timed out (110: Operation timed out) while reading response header from upstream, client: 172.18.0.1, server: stockstalker.tk"
}
```

### Signing In Users

**Request**:

url: "/user/signin"

method: POST

The request expects in the body a *username* and *password*.

Username must be between *4 and 25* characters long.

Password must be between *8 and 25* characters long.

Example request body:

```json
{
  "username": "newuser",
  "password": "password"
}
```

Types:

- username: String
- password: String

**Response**:

Success status code: 200

A successful response will send a Bearer token to be set in the Authorization header.
This header will be evaluated for all restricted routes.

Example Authorization header for your reference:

```js
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZBS0VVU0VSIiwidXNlcklkIjoiNjA1M2JlZTg5YzU3MTcwMTQyMDExYzM2IiwiaWF0IjoxNjE2MTAxMTIzLCJleHAiOjE2MTYxMDQ3MjN9.IzWXlrFS7mQqR652keVEHnR4ayspk5yyyMjRpYTY7gw'
}
```

Additionally, the response will send a success message to verify your user is now signed in.

Example response:

```json
{
  "message": "Sign in successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZBS0VVU0VSIiwidXNlcklkIjoiNjA1M2JlZTg5YzU3MTcwMTQyMDExYzM2IiwiaWF0IjoxNjE2MTAxMTIzLCJleHAiOjE2MTYxMDQ3MjN9.IzWXlrFS7mQqR652keVEHnR4ayspk5yyyMjRpYTY7gw"
}
```

Types:

- message: String
- token: String

Validation error status code: 422

In the event that the request body cannot be validated, a status code of 422 will be returned, along with an error message containing something similar to (for example):

```json
"ValidationError": "Username must be more than 4 characters"
```

Cannot find user error status code: 401

In the event that the username entered does not correspond to an existing user, a status code of 401 will be returned, along with an error message like the following:

```json
{
  "message": "User does not exist!"
}
```

Error status code: 500

In the event that there is another error due to a failure on the server side, a status code of 500 will be returned, along with a message stating the error.

Example 500 error message:

```json
{
  "err": "[error] 29#29: *17 upstream timed out (110: Operation timed out) while reading response header from upstream, client: 172.18.0.1, server: stockstalker.tk"
}
```

## User Watchlists

Each user is able to track a watchlist - a list of stocks they're interested in tracking the performance of.

### Adding to the Watchlist

**Request**:

url: '/user/watchlist'

method: PATCH

Example request body:

```json
{
  "symbol": "AAPL"
}
```

Types:

- symbol:String

**Response**:
