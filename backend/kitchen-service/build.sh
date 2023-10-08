#!/bin/bash

APP="${PWD##*/}"

# Building docker image
echo "Begin: Building docker image nestjs-restaurant-nobff/$APP"
docker build -t "nestjs-restaurant-nobff/$APP" .
echo "Done: Building docker image nestjs-restaurant-nobff/$APP"
