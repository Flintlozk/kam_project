currentUser = 0
currentMessage = 0

local json = require("../dkjson")


request = function()
    currentMessage = currentMessage + 1
    wrk.method = "POST"
    wrk.headers["mc-load-test"] = "WRK"
    wrk.headers["Content-Type"] = "application/json"


    local open = io.open
    local file = open("fb-message.json", "rb")
    if not file then return nil end
    local jsonString = file:read "*a"
    file:close()

    local jsonTable = json.decode(jsonString)
    for key,value in ipairs(jsonTable) 
    do
        if currentMessage == key then 
            wrk.body = json.encode(value)
        end
    end
    return wrk.format(nil,'/facebook-webhook-loadtest')
end

response = function(status, headers, body)
    print('RESPONED',status, headers, body)
end

-- wrk -t1 -c1 -d1 -s ./publish-line-force.lua http://localhost:8740 --timeout=5s --latency

