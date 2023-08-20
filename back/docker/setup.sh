#!/bin/bash

if [ ! -f /app/config/.env ]; then
    cp .env /app/config/.env
fi
npm rebuild bcrypt --update-binary

exec "$@"