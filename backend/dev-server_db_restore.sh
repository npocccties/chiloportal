#!/bin/sh
docker-compose exec -T db pg_restore --clean -h 127.0.0.1 -p 5432 -d develop -U postgres -v < /var/chiloportal.dump
