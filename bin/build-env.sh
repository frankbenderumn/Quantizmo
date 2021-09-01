#!/bin/bash

ROOTDIR=`git rev-parse --show-toplevel`
source ${ROOTDIR}/config/settings

docker build $1 \
	--target env \
	--build-arg USER_ID=$(id -u) \
	--build-arg GROUP_ID=$(id -g) \
	--build-arg DEP_DIR=${DEP_DIR} \
	--build-arg SRC_DIR=/env \
	-t ${DOCKER_IMAGE_PREFIX}/env "$ROOTDIR"
