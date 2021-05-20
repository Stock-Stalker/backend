# StockStalker - Backend API

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

`debug`: Start development server in debug mode

`test`: Start test server

`test-security`: Test security vulnerabilities (must have [snyk](https://support.snyk.io/hc/en-us/articles/360003812538-Install-the-Snyk-CLI) installed globally)

`reload-test`: Reload test server

`hard-reload-test`: Remove container, rebuild container, and start test server

`start-prod`: Start the production server

`debug-prod`: Start the production server in debug mode

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

Additionally you'll need to create `secrets.mk`, a Makefile at the root of the project with the following vars:

- snyk_auth_token

Once you have your environment fully set up and secrets secured, run:

```bash
make start
```

To stop the app press `CNTRL + C`. Then run:

```bash
make stop
```