-- remove dependent table first
DROP TABLE IF EXISTS user_roles;

-- drop incorrect roles table
DROP TABLE IF EXISTS roles;

-- recreate roles table correctly
CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) UNIQUE NOT NULL,
                       parent_role BIGINT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       deleted BOOLEAN DEFAULT FALSE
);

-- recreate mapping table
CREATE TABLE user_roles (
                            user_id UUID NOT NULL,
                            role_id BIGINT NOT NULL,
                            PRIMARY KEY (user_id, role_id),
                            CONSTRAINT fk_user
                                FOREIGN KEY(user_id) REFERENCES users(id),
                            CONSTRAINT fk_role
                                FOREIGN KEY(role_id) REFERENCES roles(id)
);
-- insert base roles
INSERT INTO roles(name) VALUES ('ADMIN');
INSERT INTO roles(name) VALUES ('DOCTOR');
INSERT INTO roles(name) VALUES ('PATIENT');
INSERT INTO roles(name) VALUES ('STORE');
INSERT INTO roles(name) VALUES ('SALES');