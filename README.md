<div align="center">
  <img alt="Logo" src="https://raw.githubusercontent.com/kamilkaminski01/monitoring-system/master/public/favicon-512x512.png" width="100" />
</div>

<h1 align="center">Monitoring System</h1>

This project contains multiplayer apps such as bingo, tic-tac-toe and a whiteboard.
The core feature allows authenticated users to monitor games in real-time
and communicate with each other through a chat.

![demo](https://raw.githubusercontent.com/kamilkaminski01/monitoring-system/master/frontend/src/assets/images/demo.png)

## Resources

The code repository is hosted on
[GitHub](https://github.com/kamilkaminski01/monitoring-system).

The server side application is written in the `Django` framework.

WebSockets are handled by the [Django Channels](https://channels.readthedocs.io/en/latest/) framework.

Channel layers are handled by [Redis](https://redis.io/).

User interface is written in the `React` framework.

Containerized with `Docker` and deployed to [AWS EC2](https://aws.amazon.com/ec2/)

## Running from sources

### Docker Compose setup

```bash
git clone https://github.com/kamilkaminski01/monitoring-system
cd monitoring-system/
make build
make run
```

[Docker Compose](https://docs.docker.com/compose/install/) is leveraged
for reproducible builds and consistent local development environments.
The default [`docker-compose.yml`](docker-compose.yml) file is set up
to support local development with code reload and debug mode.

[`Makefile`](Makefile) contains common commands that can be used to
build, run, and test the project. The most important commands include:
- `build`: builds the project with Docker Compose.
- `run`: runs the project with Docker Compose.
- `flush`: flushes data from the database.
- `check`: performs backend static code checks.
- `frontcheck`: performs frontend static code checks.
- `clear`: stops the currently running services and removes the volumes.

When using a local Python environment, [`pre-commit`](https://pre-commit.com/)
is installed and ran on staged files to ensure that the code
quality standards are met. During frontend development, Git hooks are handled
by [`husky`](https://github.com/typicode/husky).

#### Troubleshooting

In case of errors with typing or missing dependencies, try to rebuild the
Docker images:

```bash
make clear
docker compose up --build --force-recreate
```

If `make` is not supported, the associated Docker Compose commands can be
used directly in order to build and run the project:

```bash
git clone https://github.com/kamilkaminski01/monitoring-system
cd monitoring-system/
docker compose build
docker compose run
```

## Code quality standards

The `master` branch is a stable branch used for releases.

Git branches are named according to the
[Git Flow](https://danielkummer.github.io/git-flow-cheatsheet/) methodology.
For example:

```bash
# Branches:
feature/add-user-model
fix/missing-email-bug

# Commit names:
Add user model
```

### Backend

All backend code is formatted and verified by the `black`, `flake8`,
`mypy` and `isort` tools. Their configurations can be found in the
[.setup.cfg](backend/setup.cfg) file. Additionally, `pre-commit` [checks](.pre-commit-config.yaml)
are performed in order to verify whitespaces, credentials, etc.

Custom functions and methods use **type hints** to improve IDE code
completions, prevent from type errors and extend code documentation.

### Frontend

All frontend code is formatted and verified by the `prettier`
and `eslint` tools. Pre-commit hooks are set up with `husky`.
