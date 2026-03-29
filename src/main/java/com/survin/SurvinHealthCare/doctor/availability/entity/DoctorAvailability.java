package com.survin.SurvinHealthCare.doctor.availability.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "doctor_availability")
@Getter
@Setter
public class DoctorAvailability {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID doctorId;

    private String dayOfWeek; // "MONDAY", "TUESDAY" etc

    private LocalTime startTime; // 09:00

    private LocalTime endTime;   // 17:00

    private Boolean isAvailable;
}