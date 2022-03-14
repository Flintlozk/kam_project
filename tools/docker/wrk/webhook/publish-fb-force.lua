currentUser = 0
currentMessage = 0


request = function()
    wrk.method = "POST"
    wrk.headers["mc-load-test"] = "WRK"
    wrk.headers["Content-Type"] = "application/json"

    wrk.body = '{"object":"page","entry":[{"id":"106821459400821","time":1634292376282,"messaging":[{"sender":{"id":"2622191497882524"},"recipient":{"id":"106821459400821"},"timestamp":1634292376151,"message":{"mid":"m_fO7u0unIO5SLV2X_diZuAjl8Cot08lbsPY3YwZ_JbSIGXobal28M1zuyUrUDpphJr6IMxHO5qUzluV_ZIHRo-A","text":"ok"}}]}]}'
    return wrk.format(nil,'/facebook-webhook-loadtest')
end

response = function()
    print('RESPONED')
end

-- wrk -t1 -c1 -d1 -s ./publish-fb-force.lua http://localhost:8740 --timeout=5s --latency