#!/bin/sh
sed 's/_ENV_/'"production"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g' ./scripts/plusmar-project/yml/admin.tpl.yml > admin.yml
kubectl apply -f admin.yml --namespace=plusmar
