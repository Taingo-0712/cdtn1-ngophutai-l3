#!/bin/sh
# Called once by the official PostgreSQL image when the data directory is empty.
set -eu

echo "[DB_INIT] Applying L3 migrations in filename order"
for script in /db-migrations/*.sql; do
    echo "[DB_INIT] Applying $(basename "$script")"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$script"
done

echo "[DB_INIT] Loading SQL reference/seed data"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /db-seed/001_seed_demo.sql
echo "[DB_INIT] Done"
