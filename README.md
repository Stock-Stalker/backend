<!-- logo -->
<p align="center">
  <img width="300" src="logo.png">
</p>

<!-- short description -->
<h3 align="center">The the API powering StockStalker</h3>
<h1 align="center">StockStalker - Backend API </h1>

<p align="center">
    <!-- license -->
    <img src="https://img.shields.io/github/license/Stock-Stalker/backend" />
    <!-- code size  -->
    <img src="https://img.shields.io/github/languages/code-size/Stock-Stalker/backend" />
    <!-- issues -->
    <img src="https://img.shields.io/github/issues/Stock-Stalker/backend" />
    <!-- pull requests -->
    <img src="https://img.shields.io/github/issues-pr/Stock-Stalker/backend" />
    <!-- number of commits per year -->
    <img src="https://img.shields.io/github/commit-activity/y/Stock-Stalker/backend" />
    <!-- last commit -->
    <img src="https://img.shields.io/github/last-commit/Stock-Stalker/backend" />
    <!-- docker image size -->
    <img src="https://img.shields.io/docker/image-size/starlightromero/stockstalker-backend" />
    <!-- docker pulls -->
    <img src="https://img.shields.io/docker/pulls/starlightromero/stockstalker-backend" />
    <!-- website status -->
    <img src="https://img.shields.io/website?url=https%3A%2F%2Fstockstalker.tk" />
</p>


## Table of Contents

- [Make Commands](#make-commands)
- [Required Software](#required-software)
- [How to Run](#how-to-run)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)


## Makefile Commands

`stop`: Stop the running server

`rm`: Remove all unused containers

`rm-all`: Stop and remove all containers

`rmi`: Remove stockstalker images without removing base images. Useful for speeding up build time when switching from one start script to another such as `make start` to `make test`

`rmi-all`: Remove all images

`purge`: _Use with caution_ Completely purge Docker containers, networks, images, volumes, and cache

`lint`: Run prettier and eslint

`build`: Build development server without running the server

`start`: Start development server at port `8080`

`reload`: Stop development server and restart the server at port `8080`

`hard-reload`: Stop container, remove container, rebuild container, and start development server

`debug`: Start development server in debug mode

`test`: Start test server

`test-security`: Test security vulnerabilities (must have [snyk](https://support.snyk.io/hc/en-us/articles/360003812538-Install-the-Snyk-CLI) installed globally)

`test-image-security`: Test security vulnerabilities for base images (must have [snyk](https://support.snyk.io/hc/en-us/articles/360003812538-Install-the-Snyk-CLI) installed globally)

`reload-test`: Reload test server

`hard-reload-test`: Stop container, remove container, rebuild container, and start test server


## Required Software

- [Docker](https://docs.docker.com/get-docker/)
- [docker-comopse](https://docs.docker.com/compose/install/)
- [CMake](https://cmake.org/install/)


## How to Run

Clone the repo
```zsh
git clone git@github.com:Stock-Stalker/backend.git
```

cd into the directory
```zsh
cd backend
```

Rename `.env.sample` to `.env`
```zsh
mv .env.sample .env
```

Edit the `.env` file to contain your environment variables
```zsh
vim .env
```

Run the application!
```zsh
make start
```

To stop the app press `CNTRL + C`. Then run:
```zsh
make stop
```


## API Documentation

Base URL
```http
https://stockstalker.tk/api
```

### Get All Stocks

#### Request

```http
GET https://stockstalker.tk/api/stock
```

#### Response

Success status code: `200`

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

Error status code: `500`

An unsuccessful request, for any reason (such as the database connection times out, or there's another server-side issue) will result in an error response:

```json
{
    "message": "Connection refused."
}
```

### Get One Stock

#### Request

```http
GET https://stockstalker.tk/api/stock/:symbol
```

Where :symbol refers to the unique ticker symbol for a given stock.

> Ex: AAPL for Apple

Can also accept the company name, case insensitive.

> Ex: Apple, ApPle, apple, or APPLE

The company name or symbol sent in the query parameters will be validated.

#### Response

Success status code: `200`

Successful responses will return `stockData`. An example response:

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
  - historicalData: Array(Objects)
    - datetime: String
    - open: String
    - high: String
    - low: String
    - close: String
    - volume: String

Error status code: `404`

An unsuccessful validation (for example, inserting a company name that doesn't exist) will return a 404 status code for "resource not found". An example error response:

```json
{
    "message": "Cannot Find The Company or Symbol"
}
```

### Get Popular Stocks

#### Request

```http
GET https://stockstalker.tk/api/stock/popular
```

The route returns the current price of popular stocks: Apple Inc (AAPL), Tesla (TSLA), Netflix (NFLX), Amazon (AMZN), Facebook (FB).

#### Response

Success status code: `200`

An example response:

```json
{

  "AAPL": {
              "price": "123.71500"
          },
   ...

}
```

Types:

- Array
  - Symbol: Object
    - price: Number

Error status code: `500`

In the event that there is another error due to a failure on the server side, a status code of 500 will be returned, along with a message stating the error.

### Get Stock Prediction

#### Request

```http
GET https://stockstalker.tk/api/stock/prediction/:symbol
```

Where :symbol refers to the unique ticker symbol for a given stock.

> Ex: AAPL for Apple

Can also accept the company name, case insensitive.

> Ex: Apple, ApPle, apple, or APPLE

The company name or symbol sent in the query parameters will be validated.

#### Response

Success status code: `200`

An example response:

```json
{

  "prediction": 0

}
```

Types:

- prediction: Integer

Error status code: `500`

In the event that there is another error due to a failure on the server side, a status code of 500 will be returned, along with a message stating the error.

## Users

Users are able to make accounts with StockStalker to track their own watchlist. This enables users to quickly access the stocks that matter to them.

### Signing Up Users

#### Request

```http
POST https://stockstalker.tk/api/user/signup
```

The request expects in the body a _username_ and _password_.

Username must be between _4 and 25_ characters long.

Password must be between _8 and 25_ characters long.

Example request body:

```json
{
    "username": "newuser",
    "password": "password"
}
```

Types:

-   username: String
-   password: String

#### Response

Success status code: `200`

A successful response will send a Bearer token to be set in the Authorization header. This header will be evaluated for all restricted routes.

Example Authorization header for your reference:

```javascript
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZBS0VVU0VSIiwidXNlcklkIjoiNjA1M2JlZTg5YzU3MTcwMTQyMDExYzM2IiwiaWF0IjoxNjE2MTAxMTIzLCJleHAiOjE2MTYxMDQ3MjN9.IzWXlrFS7mQqR652keVEHnR4ayspk5yyyMjRpYTY7gw"
}
```

Types:

-   message: String
-   user: Object

    -   username: String

-   token: String

Validation error status code: `422`

In the event that the request body cannot be validated, a status code of 422 will be returned, along with an error message containing something similar to (for example):

```json
"ValidationError": "Username must be more than 4 characters"
```

Error status code: `409`

In the event that the username you are attempting to sign up with already exists, a status code of 409 will be returned, along with a message stating that the user already exists.

Example 409 error message:

```json
{
    "message": "User already exists!"
}
```

Error status code: `500`

In the event that there is another error due to a failure on the server side, a status code of 500 will be returned, along with a message stating the error.

Example 500 error message:

```json
{
    "err": "[error] 29#29: *17 upstream timed out (110: Operation timed out) while reading response header from upstream, client: 172.18.0.1, server: stockstalker.tk"
}
```

### Signing In Users

#### Request

```http
POST https://stockstalker.tk/api/user/signin
```

The request expects in the body a _username_ and _password_.

Username must be between _4 and 25_ characters long.

Password must be between _8 and 25_ characters long.

Example request body:

```json
{
    "username": "newuser",
    "password": "password"
}
```

Types:

-   username: String
-   password: String

#### Response

Success status code: `200`

A successful response will send a Bearer token to be set in the Authorization header. This header will be evaluated for all restricted routes.

Example Authorization header for your reference:

```javascript
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

Validation error status code: `422`

In the event that the request body cannot be validated, a status code of 422 will be returned, along with an error message containing something similar to (for example):

```json
"ValidationError": "Username must be more than 4 characters"
```

Cannot find user error status code: `401`

In the event that the username entered does not correspond to an existing user, a status code of 401 will be returned, along with an error message like the following:

```json
{
    "message": "User does not exist!"
}
```

Error status code: `500`

In the event that there is another error due to a failure on the server side, a status code of 500 will be returned, along with a message stating the error.

Example 500 error message:

```json
{
    "err": "[error] 29#29: *17 upstream timed out (110: Operation timed out) while reading response header from upstream, client: 172.18.0.1, server: stockstalker.tk"
}
```

## User Watchlists

Each user is able to track a watchlist - a list of stocks they're interested in tracking the performance of.

### Adding To or Removing From the Watchlist

#### Request

```http
PATCH https://stockstalker.tk/api/user/watchlist
```

To add or remove a stock from a user's watchlist, send the `symbol` in the request body. StockStalker will then check for the presence of this stock in the watchlist. If the stock is already present, it will interpret the request as a "remove" request. If the stock is not present, it will be interpreted as an "add" request.

Example request body:

```json
{
    "symbol": "AAPL"
}
```

Types:

- symbol: String

#### Response

Success status code: `200`

A successful response will return the user's watchlist. An example response is as follows:

```json
{
  "watchlist": [
    {
      "_id": "6052a534e808fd0e72580cf2",
      "symbol": "AAPL",
      "companyName": "Apple, Inc. - Common Stock"
    },
    {
      "_id": "6052a534e808fd0e72580cf2",
      "symbol": "TSLA",
      "companyName": "Tesla - Common Stock"
    }
  ]
}
```

Types:

- watchlist: List containing objects
  - _id: String (representing objectId)
  - symbol: String
  - companyName: String

Error status code: `403`

An erroneous response will resolve with a status code of 403, and send the error message.

```json
{
  "message": "error message"
}
```

### Getting a User's Watchlist

#### Request

To get the logged in user's watchlist, you will make the following request.

```http
GET https://stockstalker.tk/api/user/watchlist
```

#### Response

Success status code: `200`

A successful response will return the user's watchlist. An example response is as follows:

```json
{
  "watchlist": [
    {
      "_id": "6052a534e808fd0e72580cf2",
      "symbol": "AAPL",
      "companyName": "Apple, Inc. - Common Stock"
    },
    {
      "_id": "6052a534e808fd0e72580cf2",
      "symbol": "TSLA",
      "companyName": "Tesla - Common Stock"
    }
  ]
}
```

Types:

- watchlist: List containing objects
  - _id: String (representing objectId)
  - symbol: String
  - companyName: String

Error status code: `403`

An erroneous response will resolve with a status code of 403, and send the error message.

```json
{
  "message": "error message"
}
`
```

## Predictions

Let's face it - the most interesting thing about StockStalker is the ability to receive predictions about the potential performance of a stock.

### Getting a Prediction for a Stock

#### Request

```http
GET https://stockstalker.tk/api/stock/prediction/:symbol
```

Example request url:

```http
GET http://stockstalker.tk/api/stock/prediction/aapl

GET http://stockstalker.tk/api/stock/prediction/AAPL
```

#### Response

Success status code: `200`

A successful response will return a status code of 200, and the prediction or list of predictions for the given stock.

The current version of StockStalker does not return predictions if there is no news that day for the given stock. If there are no headlines matching your desired company's stock keywords, our prediction model will return a neutral prediction.

Example neutral response:

```json
{
    "prediction": 2
}
```

Types:

- prediction:Integer

When there are headlines about a given company, StockStalker will return to you a list of predictions. The most common prediction is the most likely for the day. Each headline generates a prediction.

Example response when headlines are present for the day:

```json
{
    "prediction": [0, 1, 1, 1, 1]
}
```

Types:

- prediction: List of integers

Error status code: `500`

When there is an error, a status code of 500 will be returned, along with the error message.

Example error response:

```json
{
    "message": "This is an error message"
}
```


## Running Tests

To run tests simple run:
```zsh
make test
```

If any of the tests fail or if the tests do not have at least 90% coverage the command will exit with a status code of `1`.