#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g' ./scripts/crm-project/yml/frontend.tpl.yml > frontend.yml
kubectl apply -f frontend.yml --namespace=crm
