CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       name VARCHAR(100),
                       email VARCHAR(100) UNIQUE,
                       phone VARCHAR(20),
                       password VARCHAR(255),
                       is_active BOOLEAN DEFAULT TRUE,
                       created_at TIMESTAMP
);