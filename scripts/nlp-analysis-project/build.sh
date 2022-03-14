#!/bin/bash
cd ..
cd ..
docker rmi -f nlp
DOCKER_BUILDKIT=1 docker build -t nlp -f ./apps/nlp-analysis/nlp/Dockerfile .