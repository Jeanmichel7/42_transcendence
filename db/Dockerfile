FROM postgres

RUN apt-get update && apt install -y sudo &&\
    adduser postgres sudo

COPY ./cleanedDb.sql /docker-entrypoint-initdb.d/
