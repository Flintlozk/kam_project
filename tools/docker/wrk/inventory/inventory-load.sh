#!/bin/bash

echo "LOAD : inventory-load"
wrk -t1 -c25 -d20 -s ./inventory-load.lua http://localhost:8741 --timeout=5s --latency