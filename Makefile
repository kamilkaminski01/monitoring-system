# Set the COMPOSE_FILE variable to the appropriate file based on the environment
ifeq ($(ENV),prod)
    COMPOSE_FILE=docker-compose.prod.yml
else
    COMPOSE_FILE=docker-compose.yml
endif

build:
    docker-compose -f $(COMPOSE_FILE) build

run:
ifeq ($(ENV),prod)
    docker-compose -f $(COMPOSE_FILE) up -d
else
    docker-compose -f $(COMPOSE_FILE) up
endif

superuser:
    docker-compose -f $(COMPOSE_FILE) run --rm backend python manage.py createsuperuser

flush:
    docker-compose -f $(COMPOSE_FILE) run --rm backend python manage.py flush

check:
    docker-compose -f $(COMPOSE_FILE) run --rm backend isort --check-only .
    docker-compose -f $(COMPOSE_FILE) run --rm backend black --check .
    docker-compose -f $(COMPOSE_FILE) run --rm backend flake8 .
    docker-compose -f $(COMPOSE_FILE) run --rm backend mypy .

frontcheck:
    docker-compose -f $(COMPOSE_FILE) run --rm frontend npm run --rm check

isort:
    docker-compose -f $(COMPOSE_FILE) run --rm backend isort .

black:
    docker-compose -f $(COMPOSE_FILE) run --rm backend black .

flake8:
    docker-compose -f $(COMPOSE_FILE) run --rm backend flake8 .

mypy:
    docker-compose -f $(COMPOSE_FILE) run --rm backend mypy .

migrations:
    docker-compose -f $(COMPOSE_FILE) run --rm backend python manage.py makemigrations

migrate:
    docker-compose -f $(COMPOSE_FILE) run --rm backend python manage.py migrate

down:
ifeq ($(ENV),prod)
    docker-compose -f $(COMPOSE_FILE) down -v
else
    docker-compose -f $(COMPOSE_FILE) down
endif

clear:
    docker-compose -f $(COMPOSE_FILE) down -v
    docker system prune --force
    docker volume prune --force
