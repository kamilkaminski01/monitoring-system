# Set the COMPOSE_FILE variable to the appropriate file based on the environment

ifeq ($(ENV),dev)
	COMPOSE_FILE=docker-compose.dev.yml
else ifeq ($(ENV),prod)
	COMPOSE_FILE=docker-compose.prod.yml
endif

build:
	docker-compose -f $(COMPOSE_FILE) build

run:
	docker-compose -f $(COMPOSE_FILE) up

superuser:
	docker-compose -f $(COMPOSE_FILE) run django python manage.py createsuperuser

flush:
	docker-compose -f $(COMPOSE_FILE) run django python manage.py flush

check:
	docker-compose -f $(COMPOSE_FILE) run --rm django isort --check-only .
	docker-compose -f $(COMPOSE_FILE) run --rm django black --check .
	docker-compose -f $(COMPOSE_FILE) run --rm django flake8 .
	docker-compose -f $(COMPOSE_FILE) run --rm django mypy .

frontcheck:
	docker-compose -f $(COMPOSE_FILE) run react npm run --rm check

isort:
	docker-compose -f $(COMPOSE_FILE) run --rm django isort .

black:
	docker-compose -f $(COMPOSE_FILE) run --rm django black .

flake8:
	docker-compose -f $(COMPOSE_FILE) run --rm django flake8 .

mypy:
	docker-compose -f $(COMPOSE_FILE) run --rm django mypy .

migrations:
	docker-compose -f $(COMPOSE_FILE) run django python manage.py makemigrations

migrate:
	docker-compose -f $(COMPOSE_FILE) run django python manage.py migrate

clear:
	docker-compose -f $(COMPOSE_FILE) down -v
	docker system prune --force
	docker volume prune --force
