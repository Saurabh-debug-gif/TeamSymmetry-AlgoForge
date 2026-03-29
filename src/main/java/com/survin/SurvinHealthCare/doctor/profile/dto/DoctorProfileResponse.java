package com.survin.SurvinHealthCare.doctor.profile.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class DoctorProfileResponse {

    private UUID id;           // ← Profile ID
    private UUID userId;       // ← User ID
    private String name;       // ← User.name se ✅
    private String email;      // ← User.email se ✅
    private String clinicName;
    private String clinicAddress;
    private String specialization;
    private Double consultationFee;
    private Integer experienceYears;
    private String about;
    private List<String> languages;
    private String phone;
    private String whatsapp;
    private String profilePhoto;
    private Boolean isVerified;
}