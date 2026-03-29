package com.survin.SurvinHealthCare.doctor.profile.controller;

import com.survin.SurvinHealthCare.doctor.profile.dto.DoctorProfileRequest;
import com.survin.SurvinHealthCare.doctor.profile.dto.DoctorProfileResponse;
import com.survin.SurvinHealthCare.doctor.profile.service.DoctorProfileService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctor/profile")
@RequiredArgsConstructor
public class DoctorProfileController {

    private final DoctorProfileService doctorProfileService;
    private final JwtService jwtService;

    // ✅ Get My Profile
    @GetMapping
    public ResponseEntity<?> getMyProfile(
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID userId = extractUserId(authHeader);
            return ResponseEntity.ok(doctorProfileService.getProfile(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ Update Profile
    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody DoctorProfileRequest request) {
        try {
            UUID userId = extractUserId(authHeader);
            return ResponseEntity.ok(doctorProfileService.updateProfile(userId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ Upload Photo
    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadPhoto(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("photo") MultipartFile file) {
        try {
            UUID userId = extractUserId(authHeader);
            return ResponseEntity.ok(doctorProfileService.uploadPhoto(userId, file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    // ✅ Get All Doctors — Public
    @GetMapping("/all")
    public ResponseEntity<?> getAllDoctors() {
        try {
            // ✅ Service mein jo bhi method name hai use karo
            return ResponseEntity.ok(doctorProfileService.getAllDoctors());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ Filter by Specialization — Public
    @GetMapping("/filter")
    public ResponseEntity<?> filterDoctors(
            @RequestParam String specialization) {
        try {
            return ResponseEntity.ok(
                    doctorProfileService.filterBySpecialization(specialization));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ Get by Profile ID — Public
    @GetMapping("/{profileId}")
    public ResponseEntity<?> getDoctorById(
            @PathVariable UUID profileId) {
        try {
            return ResponseEntity.ok(doctorProfileService.getById(profileId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Not found: " + e.getMessage());
        }
    }

    // ✅ Helper
    private UUID extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        return jwtService.extractUserId(token);
    }
}