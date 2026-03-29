package com.survin.SurvinHealthCare.appointment.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
@Getter
@Setter
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "patient_id")
    private UUID patientId;

    @Column(name = "doctor_id")
    private UUID doctorId;

    @Column(name = "status")
    private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "appointment_time")
    private LocalTime appointmentTime;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes; // Patient ka reason

    @Column(name = "doctor_description", columnDefinition = "TEXT")
    private String doctorDescription; // ← Doctor ka extra note

    @Column(name = "patient_phone")
    private String patientPhone;
}