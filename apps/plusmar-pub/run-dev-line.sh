#!/bin/bash
rm -f ./.env
echo PORT=3000 >> ./.env
echo NODE_ENV=development >> ./.env
echo GOOGLE_APPLICATION_CREDENTIALS=./AUTH.json >> ./.env
echo FACEBOOK=false >> ./.env
echo LINE=true >> ./.env
echo lineSecretKey=55f9e159994e6dff >> ./.env
echo lineSecretToppic=line-secret >> ./.env
echo redisHost=redis://127.0.0.1 >> ./.env
echo redisStorage=redis://127.0.0.1 >> ./.env
echo redisPort=6379 >> ./.env
npm run start:dev