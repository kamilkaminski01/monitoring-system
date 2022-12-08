build:
	docker-compose build

run:
	docker-compose up

superuser:
	docker-compose run django python manage.py createsuperuser

check:
	docker-compose run --rm django isort --check-only .
	docker-compose run --rm django black --check .
	docker-compose run --rm django flake8 .
	docker-compose run --rm django mypy .

frontcheck:
	docker-compose run react npm run --rm check

isort:
	docker-compose run --rm django isort .

black:
	docker-compose run --rm django black .

flake8:
	docker-compose run --rm django flake8 .

mypy:
	docker-compose run --rm django mypy .

migrations:
	docker-compose run django python manage.py makemigrations

migrate:
	docker-compose run django python manage.py migrate

clear:
	docker-compose down -v
	docker system prune --force
	docker volume prune --force
