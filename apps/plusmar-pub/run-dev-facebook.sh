#!/bin/bash
rm -f ./.env
echo PORT=3000 >> ./.env
echo NODE_ENV=development >> ./.env
echo GOOGLE_APPLICATION_CREDENTIALS=./AUTH.json >> ./.env
echo FACEBOOK=true >> ./.env
echo LINE=false >> ./.env
echo redisStorage=redis://127.0.0.1 >> ./.env
echo redisHost=redis://127.0.0.1 >> ./.env
echo redisPort=6379 >> ./.env
npm run start:dev