CREATE TABLE patient (
                         id UUID PRIMARY KEY,
                         name VARCHAR(100),
                         email VARCHAR(150),
                         phone VARCHAR(20),
                         created_at TIMESTAMP,
                         updated_at TIMESTAMP,
                         is_deleted BOOLEAN DEFAULT FALSE
);