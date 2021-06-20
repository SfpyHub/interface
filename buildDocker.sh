#!/bin/bash

# fail script on any command failure
set -e
CHANNEL="$2"

# Change this when incrementing versions.  in the future this should come from CI server.
# Kubernetes deployments use a specific version number.
DOCKER_TAG_VERSION=`date +"%Y-%m-%d_%H.%M.%S"`
DATE_STR=`date`
CURRENT_GIT_HASH=`git rev-parse HEAD`

BASE_DOCKER_TAG=sfpy-interface
BASE_REPO="gcr.io/safepay/${BASE_DOCKER_TAG}"

if [[ "X$1" = "Xpush" ]]; then
    DOCKER_LOGIN=`gcloud auth configure-docker`
    ${DOCKER_LOGIN}
fi

rm -rf ./build

yarn run build

go get ./...
go mod tidy
GOOS=linux CGO_ENABLED=0 go build -o ./build/sfpy-interface ./cmd/server/main.go

MY_USER_ID=`/usr/bin/id -un`
mkdir -p ./build/
cat << EOF > ./build/container_info.txt
This container was built on host "`hostname`" at "${DATE_STR}" by user "${MY_USER_ID}".
Container tag: ${DOCKER_TAG_VERSION}
Git hash: ${CURRENT_GIT_HASH}
EOF

cp -a Dockerfile ./scripts/*Startup.sh ./build/

# THIS SECTION MUST REMAIN UNIFORM ACROSS ALL MICROSERVICES TO WORK WITH CI Jenkins.
# << START UNIFORM BLOCK >>
if [ -z "$ALL_DOCKER_TAGS" ]
then
  ALL_DOCKER_TAGS="
    -t ${BASE_REPO}:$CHANNEL-${DOCKER_TAG_VERSION} \
    -t ${BASE_REPO}:$CHANNEL \
  "
fi

docker build $ALL_DOCKER_TAGS build

# pass "push" on command line to push the container to aws
if [[ "X$1" = "Xpush" && "$2" = "unstable" ]]; then
    docker push ${BASE_REPO}:$CHANNEL-${DOCKER_TAG_VERSION}
    docker push ${BASE_REPO}:$CHANNEL
elif [[ "X$1" = "Xpush" && "$2" = "stable" ]]; then
    docker push ${BASE_REPO}:$CHANNEL-${DOCKER_TAG_VERSION}
    docker push ${BASE_REPO}:$CHANNEL
else
    echo "please give push AND a release channel of: unstable or stable"
fi
# << END UNIFORM BLOCK >>
