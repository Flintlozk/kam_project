#!/bin/sh
apt install -y autoconf
DOCKER_CLI_VERSION="19.03.9"
DOWNLOAD_URL="https://download.docker.com/linux/static/stable/x86_64/docker-$DOCKER_CLI_VERSION.tgz"
apt install -y curl
mkdir -p /tmp/download
curl -L $DOWNLOAD_URL | tar -xz -C /tmp/download
mv /tmp/download/docker/docker /usr/local/bin/
rm -rf /tmp/download

