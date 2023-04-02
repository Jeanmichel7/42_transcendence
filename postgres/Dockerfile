# syntax=docker/dockerfile:1
FROM postgres:15

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB postgres

# Update package lists
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install sudo

# Create a new PostgreSQL cluster
RUN pg_createcluster -u postgres -g postgres -e UTF-8 15 main

# Start the PostgreSQL service
RUN sudo service postgresql start



RUN su postgres psql -h 172.19.0.2 -p 5432 -U postgres -c "CREATE USER jrasser WITH SUPERUSER PASSWORD 'jrasser';"

# Create a new user
# RUN sudo -u postgres psql -h 172.190.2 -p 5432 -U postgres -c "CREATE USER jrasser WITH SUPERUSER PASSWORD 'jrasser';"

# Create a new database
# RUN sudo -u postgres createdb -O jrasser pong_db




# # Ajoute un nouvel utilisateur avec les droits de superutilisateur
# ENV POSTGRES_USER jrasser
# ENV POSTGRES_PASSWORD jrasser
# USER postgres
# RUN /etc/init.d/postgresql start &&\
#     psql --command "CREATE USER $POSTGRES_USER WITH SUPERUSER PASSWORD '$POSTGRES_PASSWORD';"

# # Crée une nouvelle base de données
# ENV POSTGRES_DB pong_db
# RUN /etc/init.d/postgresql start &&\
#     createdb -O $POSTGRES_USER $POSTGRES_DB

# Démarre le serveur PostgreSQL
CMD ["postgres"]





# FROM ubuntu:latest

# ARG TZ
# ENV TZ=${TZ:-UTC}

# # Installation de PostgreSQL
# RUN apt-get update && apt-get upgrade &&\
#     apt-get install -y postgresql postgresql-contrib

# # Création de l'utilisateur et de la base de données
# USER postgres
# RUN /etc/init.d/postgresql start && \
#     psql --command "CREATE USER docker WITH SUPERUSER PASSWORD 'docker';" && \
#     createdb -O docker docker



# # COPY world.sql /docker-entrypoint-initdb.d/

# EXPOSE 5432

# CMD ["postgres", "-D", "/var/lib/postgresql/data", "-c", "config_file=/etc/postgresql/postgresql.conf"]