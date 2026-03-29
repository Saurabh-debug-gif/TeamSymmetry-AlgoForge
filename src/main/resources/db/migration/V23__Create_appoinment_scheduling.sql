CREATE TABLE IF NOT EXISTS appointments (
                                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    appointment_date DATE,
    appointment_time TIME,
    status VARCHAR(20) DEFAULT 'PENDING',
    notes TEXT,
    patient_phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );