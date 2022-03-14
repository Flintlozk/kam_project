#!/bin/sh
# input="./scripts/sample-project-list.txt"
input="project-list${CI_PIPELINE_ID}.txt"
while IFS= read -r line
do
  case $line in
    plusmar-back-end) npm run plusmar:gulp && ./scripts/plusmar-project/build-img-backend.sh
    ;;
    plusmar-paper-engine) ./scripts/plusmar-project/build-img-paperengine.sh
    ;;
    plusmar-front-end) ./scripts/plusmar-project/build-img-frontend.sh
    ;;
    crm-backend) ./scripts/crm-project/build-img-backend.sh
    ;;
    crm-frontend) ./scripts/crm-project/build-img-frontend.sh
    ;;
    plusmar-webhook) ./scripts/plusmar-project/build-img-webhook.sh
    ;;
    plusmar-cron-job) ./scripts/plusmar-project/build-img-cron.sh
    ;;
    # plusmar-website) ./scripts/plusmar-project/build-img-web.sh
    # ;;
    plusmar-admin) ./scripts/plusmar-project/build-img-admin.sh
    ;;
    cms-api) ./scripts/cms-project/build-img-api.sh
    ;;
    cms-admin) ./scripts/cms-project/build-img-admin.sh
    ;;
    cms-backend) ./scripts/cms-project/build-img-backend.sh
    ;;
    cms-frontend) ./scripts/cms-project/build-img-frontend.sh
    ;;
    cms-website-generator-handler) ./scripts/cms-project/build-img-website-generator-handler.sh
    ;;
    cms-website-generator) ./scripts/cms-project/build-img-website-generator.sh
    ;;
  esac
done < "$input"