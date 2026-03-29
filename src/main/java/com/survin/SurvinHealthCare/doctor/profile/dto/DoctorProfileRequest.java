package com.survin.SurvinHealthCare.doctor.profile.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter

@Setter
public class DoctorProfileRequest {

    private String profilePhoto;

    private String clinicName;

    private String clinicAddress;

    private Integer experienceYears;

    private String specialization;

    private Double consultationFee;

    private String about;

    private List<String> languages; // ← Yeh sahi hai

    private String phone;

    private String whatsapp;


}
