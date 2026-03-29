package com.survin.SurvinHealthCare.prescription.repository;

import com.survin.SurvinHealthCare.prescription.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {

    // Patient ki saari prescriptions
    List<Prescription> findByPatientId(UUID patientId);

    // Doctor ki saari prescriptions
    List<Prescription> findByDoctorId(UUID doctorId);

    // Appointment ki prescription
    Optional<Prescription> findByAppointmentId(UUID appointmentId);
}