#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g;' ./scripts/plusmar-project/yml/cron.tpl.yml > cron.yml

kubectl apply -f cron.yml --namespace=plusmar