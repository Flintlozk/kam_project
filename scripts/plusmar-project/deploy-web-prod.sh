#!/bin/sh
sed 's/_ENV_/'"production"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g' ./scripts/plusmar-project/yml/web.tpl.yml > web.yml
kubectl apply -f web.yml --namespace=plusmar
