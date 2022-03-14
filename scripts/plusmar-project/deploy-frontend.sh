#!/bin/sh
sed 's/_ENV_/'"staging"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g' ./scripts/plusmar-project/yml/frontend.tpl.yml > frontend.yml
kubectl apply -f frontend.yml --namespace=plusmar

zoneIdentifier=${CF_MC_ZONE}
curl \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "X-Auth-Email: ${CF_USER}" \
-H "X-Auth-Key: ${CF_KEY}" \
--data '{"purge_everything":true}' \
-X POST https://api.cloudflare.com/client/v4/zones/${zoneIdentifier}/purge_cache