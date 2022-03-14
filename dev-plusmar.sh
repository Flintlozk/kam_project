#!/bin/bash

if [ $# -eq 0 ]
then
 echo "No argument supplied [ cloud1,cloud2,cloud3..... cloud10"
else
    IFS=$'\t'
    array=("t1\t2\t3\t4\t5\t6\t7\t8\t9\t10")
    unset IFS
    value="$1"
    if [[ "\t${array[@]}\t" =~ "\t${value}\t" ]]; then
        export pass="true"
    else
        export pass="false"
    fi
fi

runscript () {
    publicCert=$(cat ./tools/certificate/2c2p/cert.crt)
    docker-compose up -d --remove-orphans
    npx concurrently  --names "BACKEND,WEBHOOK" -c "bgGray.bold,bgBlue.bold" "npm run plusmar:backend$value" "npm run plusmar:webhook$value"
}

killprocess() {
    {
      pkill ngrok
      ps aux | grep "nx serve plusmar-back-end" | awk '{print $2}' | xargs kill -9
      ps aux | grep "nx serve plusmar-webhook" | awk '{print $2}' | xargs kill -9
      ps aux | grep "plusmar-webhook/main.js" | awk '{print $2}' | xargs kill -9
      ps aux | grep "plusmar-back-end/main.js" | awk '{print $2}' | xargs kill -9
    } &> /dev/null
}

runngrok () {
    ngrok start -region=au --config ./ngrok.yaml backend > /dev/null &
    echo Start ngrok http://localhost:3333 wait 3 secound before start.......
    sleep 3
    export ngrok_url=$(node -pe 'JSON.parse(process.argv[1]).tunnels[0].public_url' "$(curl -s http://127.0.0.1:4040/api/tunnels)")
    if [[ $ngrok_url == *"http://"* ]]; then
        export ngrok_url=$(node -pe 'JSON.parse(process.argv[1]).tunnels[1].public_url' "$(curl -s http://127.0.0.1:4040/api/tunnels)")
    fi
    echo $ngrok_url
    cat ./tools/environment/.env_template > ./tools/environment/.env
    echo WEB_VIEW_URL=$ngrok_url >> ./tools/environment/.env
    echo BACKEND_URL=$ngrok_url >> ./tools/environment/.env
}

runalternate () {
    export ngrok_url=https://$1.itopplus.com
    cat ./tools/environment/.env_template > ./tools/environment/.env
    echo WEB_VIEW_URL=$ngrok_url >> ./tools/environment/.env
    echo BACKEND_URL=$ngrok_url >> ./tools/environment/.env
}

if [ "$pass" = "true" ]; then
    killprocess
    if [ "$2" != "" ]; then
        runalternate $2
        runscript
    else
        runngrok
        runscript
    fi
else
    echo "You should run : ./dev.sh [1-10] [NAT_NAME]"
fi