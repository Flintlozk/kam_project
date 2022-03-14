#!/bin/sh
# input="./scripts/sample-project-list.txt"
input="project-list${CI_PIPELINE_ID}.txt"
while IFS= read -r line
do
  case $line in
    plusmar-back-end) ./scripts/plusmar-project/deploy-backend-prod.sh
    ;;
    plusmar-paper-engine) ./scripts/plusmar-project/deploy-paperengine-prod.sh
    ;;
    plusmar-front-end) ./scripts/plusmar-project/deploy-frontend-prod.sh
    ;;
    crm-backend) echo ./scripts/crm-project/deploy-backend-prod.sh
    ;;
    crm-frontend) echo ./scripts/crm-project/deploy-frontend-prod.sh
    ;;
    plusmar-webhook) ./scripts/plusmar-project/deploy-webhook-prod.sh
    ;;
    plusmar-cron-job) ./scripts/plusmar-project/deploy-cron-prod.sh
    ;;
    # plusmar-website) ./scripts/plusmar-project/deploy-web-prod.sh
    # ;;
    plusmar-admin) ./scripts/plusmar-project/deploy-admin-prod.sh
    ;;
    cms-api) echo ./scripts/cms-project/deploy-api-prod.sh
    ;;    
    cms-admin) echo ./scripts/cms-project/deploy-admin-prod.sh
    ;;
    cms-backend) echo ./scripts/cms-project/deploy-backend-prod.sh
    ;;
    cms-frontend) echo ./scripts/cms-project/deploy-frontend-prod.sh
    ;;
    cms-website-generator-handler) echo ./scripts/cms-project/deploy-website-generator-handler-prod.sh
    ;;
    cms-website-generator) echo ./scripts/cms-project/deploy-website-generator-prod.sh
    ;;
  esac
done < "$input"
