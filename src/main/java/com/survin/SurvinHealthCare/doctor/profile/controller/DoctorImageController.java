package com.survin.SurvinHealthCare.doctor.profile.controller;

import com.survin.SurvinHealthCare.doctor.profile.dto.DoctorProfileResponse;
import com.survin.SurvinHealthCare.doctor.profile.service.DoctorProfileService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorImageController {

    private final DoctorProfileService doctorProfileService;
    private final JwtService jwtService;

    // ✅ Frontend "photo" naam se bhejta hai
    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadDoctorPhoto(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("photo") MultipartFile file) {
        try {
            String token = authHeader.substring(7);
            UUID userId = jwtService.extractUserId(token);
            DoctorProfileResponse response = doctorProfileService.uploadPhoto(userId, file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Upload failed: " + e.getMessage());
        }
    }
}