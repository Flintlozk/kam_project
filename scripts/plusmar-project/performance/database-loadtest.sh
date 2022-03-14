#!/bin/bash
docker run --rm  -v /$(pwd)/:/data williamyeh/wrk -t12 -c400 -d20 -s script.lua  http://192.168.1.44:3333