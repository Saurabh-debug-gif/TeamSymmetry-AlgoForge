package com.survin.SurvinHealthCare.patient.controller;

import com.survin.SurvinHealthCare.patient.dto.PatientProfileRequest;
import com.survin.SurvinHealthCare.patient.dto.PatientProfileResponse;
import com.survin.SurvinHealthCare.patient.entity.PatientProfile;
import com.survin.SurvinHealthCare.patient.service.PatientProfileService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patient/profile")
@RequiredArgsConstructor
public class PatientProfileController {

    private final PatientProfileService patientProfileService;
    private final JwtService jwtService;

    // ✅ Create Profile
    @PostMapping
    public PatientProfile createProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PatientProfileRequest request) {
        String token = authHeader.substring(7);
        UUID userId = jwtService.extractUserId(token);
        return patientProfileService.createProfile(userId, request);
    }

    // ✅ Get My Profile
    @GetMapping
    public PatientProfileResponse getMyProfile(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        UUID userId = jwtService.extractUserId(token);
        return patientProfileService.getProfileByUserId(userId);
    }

    // ✅ Update Profile
    @PutMapping
    public PatientProfileResponse updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PatientProfileRequest request) {
        String token = authHeader.substring(7);
        UUID userId = jwtService.extractUserId(token);
        return patientProfileService.updateProfile(userId, request);
    }
    // ✅ Doctor — All patients
    @GetMapping("/all")
    public List<PatientProfileResponse> getAllPatients(
            @RequestHeader("Authorization") String authHeader) {
        return patientProfileService.getAllPatients();
    }}