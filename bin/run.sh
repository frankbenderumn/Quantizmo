export UID=$(id -u)
export GID=$(id -g)
export PORT
export ROOTDIR=`git rev-parse --show-toplevel`
source ${ROOTDIR}/config/settings
export PREFIX=${DOCKER_IMAGE_PREFIX}
docker-compose run app bash