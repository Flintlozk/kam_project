#!/bin/sh
sed 's/_ENV_/'"production"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g; s/_MONGODB_/'"$MONGODB"'/g; s/_CMS_PUBLIC_KEY_/'"$CMS_PUBLIC_KEY"'/g; s/_CMS_PRIVATE_KEY_/'"$CMS_PRIVATE_KEY"'/g; s/_PG_URL_READ_/'"$PG_URL_READ"'/g; s/_PG_URL_WRITE_/'"$PG_URL_WRITE"'/g' ./scripts/cms-project/yml/backend.tpl.yml > backend.yml
kubectl apply -f backend.yml