CREATE TABLE medicals (

                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                          name VARCHAR(150),

                          phone VARCHAR(20),

                          address TEXT,

                          is_verified BOOLEAN DEFAULT TRUE,

                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);