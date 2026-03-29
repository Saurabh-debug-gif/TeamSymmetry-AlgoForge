ALTER TABLE user_roles
    ADD COLUMN id BIGSERIAL;

ALTER TABLE user_roles
DROP CONSTRAINT user_roles_pkey;

ALTER TABLE user_roles
    ADD PRIMARY KEY (id);