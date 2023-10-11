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
	docker compose -f $(COMPOSE_FILE) run --rm backend python manage.py createsuperuser

initial-data:
	docker compose -f $(COMPOSE_FILE) run --rm backend python manage.py initialize_data

flush:
	docker compose -f $(COMPOSE_FILE) run --rm backend python manage.py flush

check:
	docker compose -f $(COMPOSE_FILE) run --rm backend isort --check-only .
	docker compose -f $(COMPOSE_FILE) run --rm backend black --check .
	docker compose -f $(COMPOSE_FILE) run --rm backend flake8 .
	docker compose -f $(COMPOSE_FILE) run --rm backend mypy .

frontcheck:
	docker compose -f $(COMPOSE_FILE) run --rm $(FLAGS) frontend npm run check

isort:
	docker compose -f $(COMPOSE_FILE) run --rm $(FLAGS) backend isort .

black:
	docker compose -f $(COMPOSE_FILE) run --rm $(FLAGS) backend black .

flake8:
	docker compose -f $(COMPOSE_FILE) run --rm $(FLAGS) backend flake8 .

mypy:
	docker compose -f $(COMPOSE_FILE) run --rm $(FLAGS) backend mypy .

pytest:
	docker compose -f $(COMPOSE_FILE) run --rm backend pytest

pytest_module:
	docker compose -f $(COMPOSE_FILE) run --rm backend pytest $(module)/

migrations:
	docker compose -f $(COMPOSE_FILE) run --rm backend python manage.py makemigrations

migrate:
	docker compose -f $(COMPOSE_FILE) run --rm backend python manage.py migrate

clear:
	docker compose -f $(COMPOSE_FILE) down -v
	docker system prune --force
	docker volume prune --force
