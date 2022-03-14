#!/bin/sh
FILE="build-cheker.txt"
if [ ! -f $FILE ]; then
    git rev-parse HEAD~1 > $FILE
fi
export AFFECTED_ARGS="--base=$(cat $FILE)"
nx affected:apps $AFFECTED_ARGS --HEAD=HEAD | sed '1,3d' | awk '{ print $2 }' | sed -r '/^\s*$/d'