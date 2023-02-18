#!/usr/bin/env bash
set -e

echo "Cleaning *.pyc files"
find . -name "*.pyc" -exec rm -f {} \;

daphne backend.asgi:application -b 0.0.0.0:8000

"$@"
