CREATE TABLE doctor_profiles (

                                 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                 user_id UUID UNIQUE NOT NULL,

                                 profile_photo TEXT,

                                 clinic_name VARCHAR(150),

                                 clinic_address TEXT,

                                 experience_years INT,

                                 specialization VARCHAR(100),

                                 consultation_fee DECIMAL(10,2),

                                 about TEXT,

                                 languages TEXT[],

                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
