#!/usr/bin/env bash
set -e

echo "Cleaning *.pyc files"
find . -name "*.pyc" -exec rm -f {} \;

daphne -b 0.0.0.0 -p 8000 backend.asgi:application

"$@"
