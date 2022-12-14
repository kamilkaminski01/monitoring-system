# Monitoring System for interactive web applications

This project is used for monitoring web apps in real-time.
It allows users to interact within a chosen web application and
in addition a third party admin can observe the taken actions of users.

## Resources

The code repository is hosted on
[GitHub](https://github.com/kamilkaminski01/monitoring-system).

WebSockets are handled by the `django-channels` framework.

## Running from sources

### Docker Compose setup

```bash
git clone https://github.com/kamilkaminski01/monitoring-system
cd monitoring-system/
make build
make run
```

Users can choose and interact within available web apps on `localhost:3000` which is
the frontend domain.

Backend is available at `localhost:8000`.
Admin panel can be accessed through freely chosen backend domain at `/admin`
e.g. `localhost:8000/admin`.

[Docker Compose](https://docs.docker.com/compose/install/) is leveraged
for reproducible builds and consistent local development environments.
The default [`docker-compose.yml`](docker-compose.yml) file is set up
to support local development with code reload and debug mode.

The [`Makefile`](Makefile) contains common commands that can be used to
build, run, and test the project. The most important commands include:
- `build`: builds the project with Docker Compose.
- `run`: runs the project with Docker Compose.
- `flush`: flushes data from the database.
- `check`: performs backend static code checks.
- `frontcheck`: performs frontend static code checks.
- `clear`: stops the currently running services and removes the volumes.

If `build` doesn't run, uncheck "Use Docker Compose V2" in Docker Desktop settings.

When using a local Python environment, [`pre-commit`](https://pre-commit.com/)
should be installed and ran on staged files to ensure that the code
quality standards are met. During frontend development, Git hooks are handled
by [`husky`](https://github.com/typicode/husky).

#### Troubleshooting

In case of errors with typing or missing dependencies, try to rebuild the
Docker images:

```bash
make clear
docker-compose up --build --force-recreate
```

If `make` is not supported, the associated Docker Compose commands can be
used directly in order to build and run the project:

```bash
git clone https://github.com/kamilkaminski01/monitoring-system
cd monitoring-system/
docker-compose build
docker-compose run
```

## Code quality standards

The `master` is the stable branch used for releases.

Git branches should be named according to the
[Git Flow](https://danielkummer.github.io/git-flow-cheatsheet/) methodology.
Always include the IDs of the associated tasks in the branches and commit
names. For example:

```bash
# Branches:
feature/add-user-model
fix/missing-email-bug

# Commit names:
Add user model
```

### Backend

All backend code must be formatted and verified by the `black`, `flake8`,
`mypy` and `isort` tools. Their configurations can be found in the
[.setup.cfg](backend/setup.cfg) file. Additionally, `pre-commit` [checks](.pre-commit-config.yaml)
should be performed in order to verify whitespaces, credentials, etc.

Custom functions and methods should use **type hints** to improve IDE code
completions, prevent from type errors and extend code documentation.

### Frontend

All frontend code must be formatted and verified by the `prettier`
and `eslint` tools. Pre-commit hooks can be set up with `husky`.
