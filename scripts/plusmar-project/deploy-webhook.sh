#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g; s/_LINESUBSCRIPTION_/'"$LINESUBSCRIPTION"'/g;' ./scripts/plusmar-project/yml/webhook.tpl.yml > webhook.yml
kubectl apply -f webhook.yml --namespace=plusmar