CREATE TABLE user_role (
                           id UUID PRIMARY KEY,
                           user_id UUID NOT NULL,
                           role_id UUID NOT NULL
);