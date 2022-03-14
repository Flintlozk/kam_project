#!/bin/sh
FILE="build-cheker.txt"
if [ ! -f $FILE ]; then
    git rev-parse HEAD~1 > $FILE
fi
export AFFECTED_ARGS="--base=$(cat $FILE)"
echo $AFFECTED_ARGS > AFFECTED_ARGS.txt
#nx affected:lint
#nx affected:test
#nx affected:e2e
nx affected:apps $AFFECTED_ARGS --HEAD=HEAD | sed '1,3d' | awk '{ print $2 }' | sed -r '/^\s*$/d'