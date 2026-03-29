package com.survin.SurvinHealthCare.patient.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "patient_profiles")
@Getter
@Setter
public class PatientProfile {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID userId;
    private String profilePhoto;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;
    private String medicalHistory;
}