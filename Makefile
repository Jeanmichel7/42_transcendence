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
	docker volume rm $(shell docker volume ls -q | grep -v "^42_transcendence")

fclean:
	printf "Total clean of all configurations docker"
ifeq ($(OS),Linux)
	docker ps -qa | xargs -r docker stop
	docker system prune -a --force
	docker volume ls -q | xargs -r docker volume rm
endif
ifeq ($(OS),Darwin)
	docker ps -qa | xargs docker stop
	docker system prune -a --force
	docker volume ls -q | xargs docker volume rm
endif
	docker network prune --force

clean:
	printf "Cleaning configuration ${NAME}..."
	docker system prune -a

re:	down build

logs:
	docker-compose logs -f postgres nestjs

.PHONY	: all build down re clean fclean