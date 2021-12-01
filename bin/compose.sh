#!/bin/bash

PORT=$1

if [ -z "$1" ]
then
    PORT=8081
fi

# ROOTDIR=`git rev-parse --show-toplevel`

export UID=$(id -u)
export GID=$(id -g)
export PORT
export ROOTDIR=`git rev-parse --show-toplevel`
source ${ROOTDIR}/config/settings
export PREFIX=${DOCKER_IMAGE_PREFIX}
# docker run --rm -p 127.0.0.1:$PORT:8081 -v "${ROOTDIR}:/home/user/repo" -it ${DOCKER_IMAGE_PREFIX}/env
docker-compose -f docker-compose.yml up app
docker-compose -f docker-compose.yml up postgres
docker-compose run app bash