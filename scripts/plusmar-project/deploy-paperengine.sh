#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g' ./scripts/plusmar-project/yml/paperengine.tpl.yml > paperengine.yml
kubectl apply -f paperengine.yml --namespace=plusmar