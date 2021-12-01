# docker network create stocket

# docker run -d \
#     --network stocket --network-alias psql \
#     -v stocket-psql-data:/var/lib/psql \
#     -e PSQL_ROOT_PASSWORD=password \
#     -e PSQL_DATABASE=stocket_dev \
#     psql:10

docker run \
    --name stocket \
    -e POSTGRES_USER=joeybenz \
    -e POSTGRES_PASSWORD=password \
    -d -p 5432:5432 postgres