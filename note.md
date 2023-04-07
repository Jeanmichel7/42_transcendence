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