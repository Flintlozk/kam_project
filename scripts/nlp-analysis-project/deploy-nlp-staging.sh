#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g; s/_STAGE_/'"STAGING"'/g' ./scripts/nlp-analysis-project/yml/nlp.tpl.yml > nlp.yml
kubectl apply -f nlp.yml --namespace=plusmar