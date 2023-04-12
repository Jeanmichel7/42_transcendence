name = transcendence
all:
	printf "Launch configuration ${name}..."
	docker-compose up

build:
	printf "Building configuration ${name}..."
	docker-compose up --build

down:
	printf "Stop configuration ${name}..."
	docker-compose down
	docker volume prune

fclean:
	printf "Total clean of all configurations docker"
	docker system prune -a
	docker ps -qa | xargs -r docker stop
	docker volume ls -q | xargs -r docker volume rm
	docker network prune --force

clean:
	printf "Cleaning configuration ${name}..."
	docker system prune -a

re:	down build

logs:
	docker-compose logs -f postgres nestjs

.PHONY	: all build down re clean fclean