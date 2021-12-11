# VR Final Project

## Startup

Utilizing a linux environment and docker run the following code in the root github directory

```
./bin/compose.sh
```
This will use docker-compose.yml to build the image. Compose makes it easier to combine multiple containers and services. Next run:
```
./bin/run.sh
```
This will launch the image. From here we can use a custom cli to interact with the database and/or launch the webserver. The name of the cli is nebula.
In order to build, seed, make and launch the database and server with one command, run:
```
nebula build
```
The database only needs to be built and seeded once. To launch just the server type: 
```
nebula s
```
Then, open up a browser and navigate to localhost:8081 and website will be displayed

## Database commands

Below are individual db functions as data may change or new data may be added. These functions are a work in progress, as the end goal is a complete ORM with individual database migrations. To start the database, run:
```
nebula db
```
To migrate the database and generate the roles, tables, etc run:
```
nebula db:migrate
```
To seed the databse with dummy info, run:
```
nebula db:seed
```
