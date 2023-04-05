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

fclean:
	printf "Total clean of all configurations docker"
	@if [ -n "$$(docker ps -qa)" ]; then \
        docker stop $$(docker ps -qa); \
    else \
        echo "No running containers to stop."; \
    fi
	docker system prune --all --force --volumes
	docker volume prune --force
	docker network prune --force

clean:
	printf "Cleaning configuration ${name}..."
	docker system prune -a

re:	fclean all

logs:
	docker-compose logs -f postgres nestjs

.PHONY	: all build down re clean fclean