#!/bin/sh
mkdir -p ~/.kube
cp -f ~/.kube/config ~/.kube/config.old
cp -f ~/kubeconfig.json ~/.kube/config
kubectl config use-context external

# sed 's/_ENV_/'"production"'/g; s/_SIZE_/'"1"'/g; s/_TAG_/'"$CI_PIPELINE_ID"'/g' ./scripts/cms-project/yml/website-generator.tpl.yml > website-generator.yml
# kubectl apply -f website-generator.yml

cp -f ~/.kube/config.old ~/.kube/config
kubectl config use-context gke_itopplus-platform_asia-southeast1_itp-k8s