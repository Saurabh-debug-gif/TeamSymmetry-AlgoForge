package com.survin.SurvinHealthCare.appointment.repository;

import com.survin.SurvinHealthCare.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    void deleteByPatientId(UUID patientId);
    void deleteByDoctorId(UUID doctorId);
    // Patient ki saari appointments
    List<Appointment> findByPatientId(UUID patientId);

    // Doctor ki saari appointments
    List<Appointment> findByDoctorId(UUID doctorId);

    // Status se filter
    List<Appointment> findByDoctorIdAndStatus(UUID doctorId, String status);

    // Count by status (Admin dashboard ke liye)
    Long countByStatus(String status);
}