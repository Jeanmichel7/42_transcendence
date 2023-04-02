#!/bin/bash

echo "Waiting for postgres to start..."

while ! docker inspect postgres | grep IPAddress > /dev/null; do
  sleep 1
done

ip=$(docker inspect postgres | grep IPAddress | grep -oP '(?<="IPAddress": ")[^"]+' | sed -n '1p')
echo DB_HOST=$ip
export DB_HOST=$ip

exec "$@"