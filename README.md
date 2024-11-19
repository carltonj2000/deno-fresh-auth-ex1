# Deno Fresh Auth Example 1

## Code History

The code in this repository is base on:

- https://youtu.be/JV7yCTQAiPs?si=LrEmnxwam04G3sQG

## Creation History

```bash
deno run -A -r https://fresh.deno.dev
cd deno-fresh-auth-ex1
```

## Docker

Use `docker compose up/down` to start/stop the db.
Note once you start compose with the volume the username and
password is store in the volume and changes in the
`docker-compse.yml` have to effect because the volume
username and password will not be rewritten by compose.
Specifically `mongodb-data` is setup with the username and
password on first startup and `docker-compose.yml` can not
change that after the first startup.
The following are some manual commands I use during testing.

```bash
docker network create -d bridge some-network

docker run -d --network some-network --name some-mongo \
	-e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
	-e MONGO_INITDB_ROOT_PASSWORD=secret \
	mongo

docker run -it --rm \
    --name mongo-express \
    --network some-network \
    -p 8081:8081 \
    -e ME_CONFIG_BASICAUTH_ENABLED="false" \
    -e ME_CONFIG_MONGODB_URL="mongodb://mongoadmin:secret@some-mongo:27017" \
    mongo-express
```

Some debugging commands.

```bash
# test the setup via the command below
docker run -it --rm --network some-network mongo \
	mongosh --host some-mongo \
		-u mongoadmin \
		-p secret \
		--authenticationDatabase admin \
		some-db
> db.getName();
some-db
> exit

docker run --rm -it --network some-network  \
	jonlabelle/network-tools
```
