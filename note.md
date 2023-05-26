# TODO


if admin rom leave room ?



postgres  | 2023-05-26 21:11:37.821 UTC [137] STATEMENT:  DELETE FROM "users" WHERE "id" = $1
nestjs    | [Nest] 131  - 05/26/2023, 9:11:37 PM   ERROR [ExceptionsHandler] update or delete on table "users" violates foreign key constraint "FK_718040c5303bad75d9908ee7fc0" on table "users-relation"
nestjs    | QueryFailedError: update or delete on table "users" violates foreign key constraint "FK_718040c5303bad75d9908ee7fc0" on table "users-relation"
nestjs    |     at PostgresQueryRunner.query (/app/src/driver/postgres/PostgresQueryRunner.ts:299:19)
nestjs    |     at processTicksAndRejections (node:internal/process/task_queues:95:5)
nestjs    |     at DeleteQueryBuilder.execute (/app/src/query-builder/DeleteQueryBuilder.ts:77:33)
nestjs    |     at UsersService.deleteUser (/app/src/modules/users/users.service.ts:274:20)
nestjs    |     at UsersController.adminDeleteUser (/app/src/modules/users/users.controller.ts:165:5)
nestjs    |     at /app/node_modules/@nestjs/core/router/router-execution-context.js:46:28
nestjs    |     at /app/node_modules/@nestjs/core/router/router-proxy.js:9:17














### BACK END
npm run start:dev

### DB
sudo service postgresql start
            ou
systemctl postgresql start







### DB postgresql
config : /etc/postgresql/...
data   : /var/lib/postgresql/...
bin    : /usr/lib/postgresql/...

# connection:
psql -U jrasser -d pong_db <!-- == psql ? -->

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=jrasser
DB_PASSWORD=jrasser
DB_NAME=pong_db

## Installation et config
apt install postgresql -y
systemctl status postgresql
sudo service postgresql status
sudo su - postgres
psql

create user jrasser with password 'jrasser';
create database pong_db;
grant all privileges on database pong_db to jrasser;
<!-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO <nom_utilisateur>; -->
<!-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO <nom_utilisateur>; -->
CREATE TABLE test (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mot_de_passe TEXT NOT NULL
);
\q
exit

## PG ADMIN
# Install the public key for the repository (if not done previously):
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg

# Create the repository configuration file:
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

# Install for both desktop and web modes:
sudo apt install pgadmin4

# Configure the webserver, if you installed pgadmin4-web:
sudo /usr/pgadmin4/bin/setup-web.sh

http://localhost:5050/





## DB SAVE
sudo su - postgres
<!-- psql
\c pong_db -->
cd /var/lib/postgresql
pg_dump pong_db > save.sql
exit
exit
<!-- \q -->
docker cp postgres:/var/lib/postgresql/save.sql ./db/save.sql