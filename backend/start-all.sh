#!/bin/bash

source ./framework.sh

echo "starting all"
docker-compose --env-file ./.env.docker \
               --file menu-service/docker-compose-menu.yml \
               --file dining-service/docker-compose-dining.yml \
               --file kitchen-service/docker-compose-kitchen.yml \
               --file gateway/docker-compose-gateway.yml up -d

wait_on_health http://localhost:9500 gateway
echo "all services started behind gateway"
