CREATE TABLE doctor (
                        id UUID PRIMARY KEY,
                        name VARCHAR(100),
                        specialization VARCHAR(100),
                        created_at TIMESTAMP,
                        updated_at TIMESTAMP,
                        is_deleted BOOLEAN DEFAULT FALSE
);