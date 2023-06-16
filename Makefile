NAME = transcendence
OS	= ${shell uname}

all:
	printf "Launch configuration ${NAME}..."
	docker-compose up

build:
	printf "Building configuration ${NAME}..."
	docker-compose up --build

down:
	printf "Stop configuration ${NAME}..."
	docker-compose down
ifeq ($(OS),Linux)
	docker volume ls -q | grep -v "^42_transcendence" | xargs -r docker volume rm
else
	docker volume ls -q | grep -v "^42_transcendence" | xargs docker volume rm
endif

fclean:
	printf "Total clean of all configurations docker"
ifeq ($(OS),Linux)
	docker ps -qa | xargs -r docker stop
	docker system prune -a --force
	docker volume ls -q | xargs -r docker volume rm
else
	docker ps -qa | xargs docker stop
	docker system prune -a --force
	docker volume ls -q | xargs docker volume rm
endif
	docker network prune --force

clean:
	printf "Cleaning configuration ${NAME}..."
	docker system prune -a

re:	down build

restart:
	printf "Restarting configuration ${NAME}..."
	${MAKE} down
	docker volume rm 42_transcendence_front
	docker volume rm 42_transcendence_back
	${MAKE} build

logs:
	docker-compose logs -f postgres nestjs

dbsave:
	docker exec -t postgres pg_dump -U postgres pong_db > db/save.sql

.PHONY	: all build down re clean fclean