#!/bin/sh
echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin git.itopplus.com:5000
echo $DOCKER_HUB_PASS | docker login -u $DOCKER_HUB_USER --password-stdin
echo BUILD Image git.itopplus.com:5000/plusmar/admin:$CI_PIPELINE_ID
DOCKER_BUILDKIT=1 docker build -t git.itopplus.com:5000/plusmar/admin:$CI_PIPELINE_ID -f ./scripts/plusmar-project/dockerfiles/dockerfile-admin .
echo PUSH Image git.itopplus.com:5000/plusmar/admin:$CI_PIPELINE_ID
docker push git.itopplus.com:5000/plusmar/admin:$CI_PIPELINE_ID
