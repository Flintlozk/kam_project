#!/bin/sh
sed 's/_ENV_/'"production"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g; s/_STAGE_/'"PRODUCTION"'/g; s/_MONGODB_/'"$NLPMONGODB"'/g; s/_HOSTMONGO_/'"$NLPHOSTMONGO"'/g; s/_USERMONGO_/'"$NLPUSERMONGO"'/g; s/_PASSMONGO_/'"$NLPPASSMONGO"'/g; s/_PGDB_/'"$NLPPGDB"'/g; s/_USERPG_/'"$NLPUSERPG"'/g; s/_PASSPG_/'"$NLPPASSPG"'/g; s/_HOSTPG_/'"$NLPHOSTPG"'/g; s/_PORTPG_/'"$NLPPORTPG"'/g;' ./scripts/nlp-analysis-project/yml/nlp.tpl.yml > nlp.yml
kubectl apply -f nlp.yml --namespace=plusmar