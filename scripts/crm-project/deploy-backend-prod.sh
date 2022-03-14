#!/bin/sh
sed 's/_ENV_/'"production"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g; s/_REDIS_HOST_CRM_/'"$REDIS_HOST_CRM"'/g; s/_PAGE_KEY_/'"$PAGE_KEY"'/g; s/_TOKEN_KEY_/'"$TOKEN_KEY"'/g; s/_PG_URL_READ_CRM_/'"$PG_URL_READ_CRM"'/g; s/_PG_URL_WRITE_CRM_/'"$PG_URL_WRITE_CRM"'/g' ./scripts/crm-project/yml/backend.tpl.yml > backend.yml
kubectl apply -f backend.yml --namespace=crm
