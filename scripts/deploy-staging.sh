#!/bin/sh
# input="./scripts/sample-project-list.txt"
input="project-list${CI_PIPELINE_ID}.txt"
while IFS= read -r line
do
  case $line in
    plusmar-back-end) ./scripts/plusmar-project/deploy-backend.sh
    ;;
    plusmar-paper-engine) ./scripts/plusmar-project/deploy-paperengine.sh
    ;;
    plusmar-front-end) ./scripts/plusmar-project/deploy-frontend.sh
    ;;
    crm-backend) ./scripts/crm-project/deploy-backend.sh
    ;;
    crm-frontend) ./scripts/crm-project/deploy-frontend.sh
    ;;
    plusmar-webhook) ./scripts/plusmar-project/deploy-webhook.sh
    ;;
    plusmar-cron-job) ./scripts/plusmar-project/deploy-cron.sh
    ;;
    # plusmar-website) echo ./scripts/plusmar-project/deploy-web.sh
    # ;;
    plusmar-admin) ./scripts/plusmar-project/deploy-admin.sh
    ;;
    cms-api) ./scripts/cms-project/deploy-api.sh
    ;;
    cms-admin) ./scripts/cms-project/deploy-admin.sh
    ;;
    cms-backend) ./scripts/cms-project/deploy-backend.sh
    ;;
    cms-frontend) ./scripts/cms-project/deploy-frontend.sh
    ;;    
    cms-website-generator-handler) ./scripts/cms-project/deploy-website-generator-handler.sh
    ;;
    cms-website-generator) ./scripts/cms-project/deploy-website-generator.sh
    ;;
  esac
done < "$input"



