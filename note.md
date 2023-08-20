# TODO

if admin room leave room ?

### BACK END

npm run start:dev

### DB

sudo service postgresql start
ou
systemctl postgresql start

### DB postgresql

config : /etc/postgresql/...
data : /var/lib/postgresql/...
bin : /usr/lib/postgresql/...

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
