#!/bin/bash

runscript () {
    npx concurrently --names "COMPONENT,-BACKEND-,GENERATOR,-HANDLER-,-CMS-API-" -c "bgGreen.bold,bgCyan.bold,bgMagenta.bold,bgBlue.bold,bgYellow.bold" "npm run require:component" "npm run cms:backend$1" "npm run cms:website-generator$1" "npm run cms:website-generator-handler" "npm run cms:api"
}

killprocess() {
    {
      ps aux | grep "cms-website-generator" | awk '{print $2}' | xargs kill -9
      ps aux | grep "cms-backend" | awk '{print $2}' | xargs kill -9
    } &> /dev/null
}

if [ "$1" != "" ]; then
    killprocess $1
    runscript $1
else
    echo '* * * * * * * *'
    echo '* * * * * * * *'
    echo 'ADD CMS NUMBER'
    echo '* * * * * * * *'
    echo '* * * * * * * *'
fi