# TODO

erreur 500 
nestjs    | [Nest] 1883  - 04/07/2023, 1:36:31 AM   ERROR [ExceptionsHandler] jwt expired
nestjs    | TokenExpiredError: jwt expired
nestjs    |     at /app/node_modules/jsonwebtoken/verify.js:190:21
nestjs    |     at getSecret (/app/node_modules/jsonwebtoken/verify.js:97:14)
nestjs    |     at Object.module.exports [as verify] (/app/node_modules/jsonwebtoken/verify.js:101:10)
nestjs    |     at JwtService.verify (/app/node_modules/@nestjs/jwt/dist/jwt.service.js:38:20)
nestjs    |     at AuthOwner.canActivate (/app/src/modules/auth/guard/authOwner.guard.ts:16:37)
nestjs    |     at GuardsConsumer.tryActivate (/app/node_modules/@nestjs/core/guards/guards-consumer.js:15:34)
nestjs    |     at canActivateFn (/app/node_modules/@nestjs/core/router/router-execution-context.js:134:59)
nestjs    |     at /app/node_modules/@nestjs/core/router/router-execution-context.js:42:37
nestjs    |     at /app/node_modules/@nestjs/core/router/router-proxy.js:9:23
nestjs    |     at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)



create user same email 
2023-04-08 16:39:43.297 UTC [3035] ERROR:  duplicate key value violates unique constraint "UQ_97672ac88f789774dd47f7c8be3"
postgres  | 2023-04-08 16:39:43.297 UTC [3035] DETAIL:  Key (email)=(ogin@student.42.mulhouse.fr) already exists.
postgres  | 2023-04-08 16:39:43.297 UTC [3035] STATEMENT:  INSERT INTO "users"("firstName", "lastName", "login", "email", "password", "role", "avatar", "description", "is2FAEnabled") VALUES ($1, $2, $3, $4, $5, DEFAULT, $6, DEFAULT, DEFAULT) RETURNING "id", "role", "is2FAEnabled"
nestjs    | [Nest] 1438  - 04/08/2023, 4:39:43 PM   ERROR [ExceptionsHandler] duplicate key value violates unique constraint "UQ_97672ac88f789774dd47f7c8be3"
nestjs    | QueryFailedError: duplicate key value violates unique constraint "UQ_97672ac88f789774dd47f7c8be3"
nestjs    |     at PostgresQueryRunner.query (/app/src/driver/postgres/PostgresQueryRunner.ts:299:19)
nestjs    |     at processTicksAndRejections (node:internal/process/task_queues:95:5)
nestjs    |     at InsertQueryBuilder.execute (/app/src/query-builder/InsertQueryBuilder.ts:163:33)
nestjs    |     at SubjectExecutor.executeInsertOperations (/app/src/persistence/SubjectExecutor.ts:428:42)
nestjs    |     at SubjectExecutor.execute (/app/src/persistence/SubjectExecutor.ts:137:9)
nestjs    |     at EntityPersistExecutor.execute (/app/src/persistence/EntityPersistExecutor.ts:197:21)
nestjs    |     at UsersController.createUser (/app/src/modules/users/users.controller.ts:43:33)
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









42_transcendence/.env
VOLUME_DB=/home/jrasser/data
DB_USERNAME=jrasser
DB_PASSWORD=jrasser
DB_NAME=pong_db

42_transcendence/back/.env
DB_PORT=5432
DB_USERNAME=jrasser
DB_PASSWORD=jrasser
DB_NAME=pong_db
JWT_SECRET=blablabla



## DB SAVE
sudo su - postgres
psql
pg_dump pong_db > save.sql
\q
docker cp postgres:/var/lib/postgresql/save.sql ./db/save.sql