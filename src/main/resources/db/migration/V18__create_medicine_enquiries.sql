CREATE TABLE medicine_enquiries (

                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                    doctor_id UUID,

                                    medical_id UUID,

                                    medicine_id UUID,

                                    message TEXT,

                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);