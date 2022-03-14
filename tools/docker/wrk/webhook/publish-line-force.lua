currentUser = 0
currentMessage = 0


request = function()
    wrk.method = "POST"
    wrk.headers["mc-load-test"] = "WRK"
    wrk.headers["Content-Type"] = "application/json"

    wrk.body = '{"destination":"U026c886591a29fbb880f0d483291c023","events":[{"type":"message","message":{"type":"text","id":"14917812466961","text":"1"},"timestamp":1634291548150,"source":{"type":"user","userId":"U5cfdb876c651c7437cc3647f5cc9bd76"},"replyToken":"77018e062f8f44ebb3fd2a1d9c01e3dc","mode":"active"}]}'
    
    return wrk.format(nil,'/loadtest')
end

response = function()
    print('RESPONED')
end

-- wrk -t1 -c1 -d1 -s ./publish-line-force.lua http://localhost:8740 --timeout=5s --latency