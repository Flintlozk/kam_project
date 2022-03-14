#!/bin/bash

runscript () {
    npx concurrently --names "COMPO,PAPER,CRONJ" -c "bgGreen.bold,bgMagenta.bold,bgBlack.bold" "npm run require:component" "npm run plusmar:paper-engine" "npm run plusmar:cron-job$1"
}

killprocess() {
    {
      pkill ngrok
      ps aux | grep "plusmar-cron-job" | awk '{print $2}' | xargs kill -9
      ps aux | grep "plusmar-paper-engine" | awk '{print $2}' | xargs kill -9
    } &> /dev/null
}

if [ "$1" != "" ]; then
    killprocess
    runscript $1
else
    echo '* * * * * * * *'
    echo '* * * * * * * *'
    echo 'ADD CRON NUMBER'
    echo '* * * * * * * *'
    echo '* * * * * * * *'
fi