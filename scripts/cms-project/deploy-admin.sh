#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g' ./scripts/cms-project/yml/admin.tpl.yml > admin.yml
kubectl apply -f admin.yml
