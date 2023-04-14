#!/bin/bash

chown -R node:node /app/.git

exec "$@"