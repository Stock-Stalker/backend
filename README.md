<!-- logo -->
<p align="center">
  <img width="300" src="logo.png">
</p>

<!-- short description -->
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

## API Documentation

Documentation can be found [here](https://github.com/Stock-Stalker/backend/wiki/StockStalker---API)

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

## How to Run

To run the app you will need:

- [Docker](https://docs.docker.com/get-docker/)
- [docker-compse](https://docs.docker.com/compose/install/)

The `.env` file is not pushed to GitHub. You'll need to create the file in the root of the `backend` directory. And within the `.env` file, you'll need:

- MONGODB_URI
- PREDICTOR_API
- ROBINHOOD_API
- STOCK_DATA_API
- SECRET_KEY
- SALT
- USER1_USERNAME
- USER1_PASSWORD
- USER2_USERNAME
- USER2_PASSWORD

Optionally, you'll need to create `secrets.mk`, a Makefile at the root of the project with the following vars:

- snyk_auth_token

Once you have your environment fully set up and secrets secured, run:

```bash
make start
```

To stop the app press `CNTRL + C`. Then run:

```bash
make stop
```
