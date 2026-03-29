CREATE TABLE medicines (

                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                           name VARCHAR(150) UNIQUE NOT NULL,

                           image_url TEXT,

                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);