BEGIN;

ALTER TABLE app_user
    ADD COLUMN IF NOT EXISTS username VARCHAR(80);

ALTER TABLE app_user
    ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_app_user_username
    ON app_user(username);

COMMIT;
