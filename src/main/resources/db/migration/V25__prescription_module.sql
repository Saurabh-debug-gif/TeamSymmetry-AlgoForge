CREATE TABLE IF NOT EXISTS prescriptions (
                                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    diagnosis TEXT,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS prescription_medicines (
                                                      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL,
    medicine_name VARCHAR(255),
    dosage VARCHAR(100),
    duration VARCHAR(100),
    timing VARCHAR(100)
    );