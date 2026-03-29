-- Add unique email constraint
ALTER TABLE users
    ADD CONSTRAINT unique_email UNIQUE(email);

-- Add unique role name
ALTER TABLE roles
    ADD CONSTRAINT unique_role_name UNIQUE(name);

-- Add primary key to user_roles
ALTER TABLE user_roles
    ADD PRIMARY KEY (user_id, role_id);

-- Add foreign key for user
ALTER TABLE user_roles
    ADD CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id);

-- Add foreign key for role
ALTER TABLE user_roles
    ADD CONSTRAINT fk_role
        FOREIGN KEY (role_id) REFERENCES roles(id);


ALTER TABLE users
    ADD COLUMN updated_at TIMESTAMP;