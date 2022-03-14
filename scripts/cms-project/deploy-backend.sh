#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g' ./scripts/cms-project/yml/backend.tpl.yml > backend.yml
kubectl apply -f backend.yml