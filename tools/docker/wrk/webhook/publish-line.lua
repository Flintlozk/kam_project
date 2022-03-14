currentUser = 0
currentMessage = 0


request = function()
    wrk.method = "POST"
    wrk.headers["MC-Load-Test"] = "WRK"
    wrk.headers["Content-Type"] = "application/json"

    userID = "Magnus_" .. currentUser
    message = "Test_" .. currentMessage

    if currentMessage == 50
    then 
        currentUser = currentUser + 1
        currentMessage = 0
    end

    timestamp = os.time(os.date("!*t"))
    print(timestamp,userID,message)
    
    wrk.body = '{"destination":"U026c886591a29fbb880f0d483291c023","events":[{"type":"message","message":{"type":"text","id":"'.. currentMessage ..'","text":"'.. message ..'"},"timestamp":'.. timestamp ..',"source":{"type":"user","userId":"'.. userID ..'"},"replyToken":"0bd76ee9c5384e38b66cd949d534b7e8","mode":"active"}]}'
    currentMessage = currentMessage + 1
    return wrk.format(nil,'/loadtest')
end

response = function()
    print('RESPONED')
end

-- wrk -t1 -c1 -d1 -s ./publish-line.lua http://localhost:8740 --timeout=5s --latency
-- curl -H "MC-Load-Test: WRK" -H "Centent-Type: application/json" -X POST http://localhost:8740/loadtest  -d '{"destination":"U026c886591a29fbb880f0d483291c023","events":[{"type":"message","message":{"type":"text","id":"currentMessage","text":"message"},"timestamp":"timestamp","source":{"type":"user","userId":"userID"},"replyToken":"0bd76ee9c5384e38b66cd949d534b7e8","mode":"active"}]}'

-- curl -H "MC-Load-Test: WRK" -H "Centent-Type: application/json" -X POST https://plusmarwebhookgateway.more-commerce.com/loadtest  -d '{"destination":"U026c886591a29fbb880f0d483291c023","events":[{"type":"message","message":{"type":"text","id":"currentMessage","text":"message"},"timestamp":"timestamp","source":{"type":"user","userId":"userID"},"replyToken":"0bd76ee9c5384e38b66cd949d534b7e8","mode":"active"}]}'