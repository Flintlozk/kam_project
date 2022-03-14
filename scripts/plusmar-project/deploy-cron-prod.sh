#!/bin/sh
sed 's/_ENV_/'"production"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g; s/_MONGODB_/'"$MONGODB"'/g; s/_REDIS_HOST_/'"$REDIS_HOST"'/g; s/_PG_URL_READ_/'"$PG_URL_READ"'/g; s/_PG_URL_WRITE_/'"$PG_URL_WRITE"'/g; s/_ORIGIN_/'"$ORIGIN"'/g' ./scripts/plusmar-project/yml/cron.tpl.yml > cron.yml
kubectl apply -f cron.yml --namespace=plusmar
