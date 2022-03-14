wrk -t2 -c5 -d10 -s ./publish-fb-readfile.lua https://plusmarapi.more-commerce.com --timeout=5s --latency
# wrk -t2 -c20 -d30 -s ./publish-fb-readfile.lua http://localhost:8740 --timeout=5s --latency