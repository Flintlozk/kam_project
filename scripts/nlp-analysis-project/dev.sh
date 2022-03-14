#!/bin/bash
cd ..
cd ..
docker run --rm -it -p 8080:8080 -v "/$(pwd)/apps/nlp-analysis/nlp:/project" nlp bash

# Production RUN
# docker run --rm -it -p 8080:8080 -e "STAGE=PRODUCTION" -e "DB_NAME_MONGO=plusmar" -e "DB_SERVICE_MONGO=mongodb+srv://plusmar:lPBD79otIqvSaOyL@itoppluscluster.ixeww.gcp.mongodb.net/plusmar?retryWrites=true&w=majority" -e "DB_USER_MONGO=plusmar" -e "DB_PASS_MONGO=lPBD79otIqvSaOyL" -e "DB_NAME_PG=plusmar" -e "DB_USER_PG=plusmar-production" -e "DB_PASS_PG=4g0Ni0gWd6G6" -e "DB_SERVICE_PG=35.186.155.175" -e "DB_PORT_PG=5432" -v "/$(pwd)/apps/nlp-analysis/nlp:/project" nlp bash