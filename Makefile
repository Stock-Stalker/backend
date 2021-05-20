-include secrets.mk

build :
				docker-compose -f docker-compose.dev.yml build --force-rm --no-cache

start:
				docker-compose -f docker-compose.dev.yml up

stop :
				docker-compose down --remove-orphans

debug :
				docker-compose -f docker-compose.dev.yml --verbose up

reload:
				docker-compose down && docker-compose -f docker-compose.dev.yml up

test :
				docker-compose -f docker-compose.test.yml up --abort-on-container-exit

test-security:
				snyk config set api=$(snyk_auth_token) && snyk test

reload-test :
				docker-compose down && docker-compose -f docker-compose.test.yml up --abort-on-container-exit

hard-reload-test :
				docker-compose down && docker rmi backend_backend && docker-compose -f docker-compose.test.yml up --abort-on-container-exit

start-prod :
				docker-compose up -d

debug-prod:
				docker-compose --verbose up

lint:
				npm run lint

rm :
				docker container prune -f
				
rm-all:
				docker stop $$(docker ps -aq) && docker rm $$(docker ps -aq)

rmi :
				docker rmi backend_backend

rmi-all:
				docker rmi $$(docker images -q)
	
purge:
				docker system prune --volumes --all -f