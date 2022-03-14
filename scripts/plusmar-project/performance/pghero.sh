#!/bin/bash
docker run -ti -e DATABASE_URL=postgres://developer:tbdadmin@35.186.155.175:5432/plusmar-staging -p 8080:8080 ankane/pghero