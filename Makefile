-include secrets.mk

build :
				TAG=$$(date +%m%d%H%M%S) docker compose -f docker-compose.dev.yml build --force-rm

start:
				TAG=$$(date +%m%d%H%M%S) docker compose -f docker-compose.dev.yml up

stop :
				docker compose -f docker-compose.dev.yml down --remove-orphans

debug :
				TAG=$$(date +%Y%m%d%H%M%S) docker compose -f docker-compose.dev.yml --verbose up

reload:
				make stop
				make start

test :
				TAG=$$(date +%Y%m%d%H%M%S) docker compose -f docker-compose.test.yml up --abort-on-container-exit

test-security:
				snyk config set api=$(snyk_auth_token)
				snyk test

test-image-security:
				snyk config set api=$(snyk_auth_token)
				snyk container test node:lts-buster-slim --file=Dockerfile --fail-on=upgradable

reload-test :
				docker compose -f docker-compose.test.yml down
				make test

hard-reload-test :
				docker compose -f docker-compose.test.yml down
				make rmi
				make test

lint:
				npm run lint

rm :
				docker container prune -f
				
rm-all:
				docker stop $$(docker ps -aq)
				docker rm $$(docker ps -aq)

rmi :
				docker rmi backend_backend

rmi-all:
				docker rmi $$(docker images -q)
	
purge:
				docker system prune --volumes --all -f