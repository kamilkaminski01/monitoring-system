# Set the COMPOSE_FILE variable to the appropriate file based on the environment

ifeq ($(ENV),prod)
	COMPOSE_FILE=docker-compose-prod.yml
else
	COMPOSE_FILE=docker-compose.yml
endif

build:
	docker compose -f $(COMPOSE_FILE) build

run:
	docker compose -f $(COMPOSE_FILE) up $(if $(filter prod,$(ENV)), -d)

down:
	docker compose -f $(COMPOSE_FILE) down

recreate:
	docker compose -f $(COMPOSE_FILE) up --build --force-recreate $(if $(filter prod,$(ENV)), -d)

superuser:
	docker compose -f $(COMPOSE_FILE) run --rm web python manage.py createsuperuser

initial-data:
	docker compose -f $(COMPOSE_FILE) run --rm web python manage.py initialize_data

flush:
	docker compose -f $(COMPOSE_FILE) run --rm web python manage.py flush

lint:
	docker compose -f $(COMPOSE_FILE) run --rm -T web isort .
	docker compose -f $(COMPOSE_FILE) run --rm -T web black .
	docker compose -f $(COMPOSE_FILE) run --rm -T web flake8 .
	docker compose -f $(COMPOSE_FILE) run --rm -T web mypy .

check:
	docker compose -f $(COMPOSE_FILE) run --rm web isort --check-only .
	docker compose -f $(COMPOSE_FILE) run --rm web black --check .
	docker compose -f $(COMPOSE_FILE) run --rm web flake8 .
	docker compose -f $(COMPOSE_FILE) run --rm web mypy .

frontcheck:
	docker compose -f $(COMPOSE_FILE) run --rm -T frontend npm run check

isort:
	docker compose -f $(COMPOSE_FILE) run --rm -T web isort .

black:
	docker compose -f $(COMPOSE_FILE) run --rm -T web black .

flake8:
	docker compose -f $(COMPOSE_FILE) run --rm -T web flake8 .

mypy:
	docker compose -f $(COMPOSE_FILE) run --rm -T  web mypy .

pytest:
	docker compose -f $(COMPOSE_FILE) run --rm web pytest

pytest_module:
	docker compose -f $(COMPOSE_FILE) run --rm web pytest $(module)/

migrations:
	docker compose -f $(COMPOSE_FILE) run --rm web python manage.py makemigrations

migrate:
	docker compose -f $(COMPOSE_FILE) run --rm web python manage.py migrate

clear:
	docker compose -f $(COMPOSE_FILE) down -v
	docker system prune --force
	docker volume prune --force
