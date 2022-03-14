#!/bin/bash
nx test --test-path-pattern=./$1 --project=`echo $1 | cut -d \/ -f 2`