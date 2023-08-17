#!/bin/bash

npm rebuild bcrypt --update-binary

exec "$@"