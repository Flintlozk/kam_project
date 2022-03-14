currentUser = 0
currentMessage = 0


request = function()
    wrk.method = "POST"
    wrk.headers["mc-load-test"] = "WRK"
    wrk.headers["Content-Type"] = "application/json"

    return wrk.format(nil,'/inventory-load')
end

response = function(status, headers, body)
    -- print('RESPONED',status, headers, body)
end

-- wrk -t1 -c1 -d1 -s ./publish-fb-force.lua http://localhost:8740 --timeout=5s --latency