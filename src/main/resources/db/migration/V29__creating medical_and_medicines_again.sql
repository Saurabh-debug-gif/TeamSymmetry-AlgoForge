CREATE TABLE IF NOT EXISTS medicals (
                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    open_time VARCHAR(50),
    close_time VARCHAR(50),
    is_verified BOOLEAN DEFAULT false
    );

CREATE TABLE IF NOT EXISTS medicines (
                                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE PRECISION DEFAULT 0,
    manufacturer VARCHAR(255),
    category VARCHAR(255),
    requires_prescription BOOLEAN DEFAULT true,
    image_url VARCHAR(500)
    );

