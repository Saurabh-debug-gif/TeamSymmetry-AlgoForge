package com.survin.SurvinHealthCare.doctor.profile.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "doctor_profiles")
@Getter
@Setter
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "profile_photo")
    private String profilePhoto;

    @Column(name = "clinic_name")
    private String clinicName;

    @Column(name = "clinic_address")
    private String clinicAddress;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(name = "about", columnDefinition = "TEXT")
    private String about;

    @Column(name = "phone")
    private String phone;

    @Column(name = "whatsapp")
    private String whatsapp;

    // ✅ @ElementCollection HATAO — directly column mein store karo
    // "English,Hindi,Marathi" format mein store hoga
    @Column(name = "languages")
    private String languages;

    // ✅ Helper methods — List se String aur String se List
    @Transient
    public List<String> getLanguagesList() {
        if (languages == null || languages.isEmpty()) return new ArrayList<>();
        return Arrays.asList(languages.split(","));
    }

    @Transient
    public void setLanguagesList(List<String> list) {
        if (list == null || list.isEmpty()) {
            this.languages = "";
        } else {
            this.languages = String.join(",", list);
        }
    }
}