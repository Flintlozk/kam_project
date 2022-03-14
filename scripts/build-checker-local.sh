#!/bin/sh
echo "Please : Before run this command you must commit the lastest code first."
# nx affected:lint --base=origin/develop --head=HEAD --parallel --maxParallel=3
# nx affected:e2e --base=origin/develop --head=HEAD

nx affected:apps --base=origin/develop --head=HEAD

# nx affected:build --base=origin/develop --head=HEAD
