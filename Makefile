-include secrets.mk
compose = docker-compose
dev = -f docker-compose.dev.yml
test = -f docker-compose.test.yml

build:
				export DOCKER_CONTENT_TRUST=1 && ${compose} ${dev} build --force-rm --no-cache

start:
				export DOCKER_CONTENT_TRUST=1 && ${compose} ${dev} up

stop:
				${compose} ${dev} down --remove-orphans

debug:
				${compose} ${dev} --verbose up

reload: stop start

hard-reload: stop rmi start

test:
				${compose} ${test} up --abort-on-container-exit

stop-test:
				${compose} ${test} down

test-security:
				snyk config set api=$(snyk_auth_token) && snyk test

test-image-security:
				snyk config set api=$(snyk_auth_token) && snyk container test node:lts-buster-slim --file=Dockerfile --fail-on=upgradable

reload-test: stop-test test

hard-reload-test: stop-test rmi test

lint:
				npm run lint

rm:
				docker container prune -f
				
rm-all:
				docker stop $$(docker ps -aq) && docker rm $$(docker ps -aq)

rmi:
				docker rmi backend_backend

rmi-all:
				docker rmi $$(docker images -q)
	
purge:
				docker system prune --volumes --all -f