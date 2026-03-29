package com.survin.SurvinHealthCare.patient.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class PatientProfileResponse {

    private UUID id;
    private String name;         // ← Users table se
    private String email;        // ← Users table se
    private String profilePhoto;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;
    private String medicalHistory;
}