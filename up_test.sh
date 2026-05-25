#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

docker compose -f docker-compose.test.yml -f docker-compose-test.yml build
docker compose -f docker-compose.test.yml -f docker-compose-test.yml up --force-recreate --abort-on-container-exit
