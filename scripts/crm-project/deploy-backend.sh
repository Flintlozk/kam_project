#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g; s/_REDIS_HOST_CRM_/'"$REDIS_HOST_CRM"'/g' ./scripts/crm-project/yml/backend.tpl.yml > backend.yml
kubectl apply -f backend.yml --namespace=crm
