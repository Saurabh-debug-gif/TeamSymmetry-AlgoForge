package com.survin.SurvinHealthCare.doctor.availability.controller;

import com.survin.SurvinHealthCare.doctor.availability.dto.DoctorAvailabilityRequest;
import com.survin.SurvinHealthCare.doctor.availability.entity.DoctorAvailability;
import com.survin.SurvinHealthCare.doctor.availability.service.DoctorAvailabilityService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctor/availability")
@RequiredArgsConstructor
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;
    private final JwtService jwtService;

    // ✅ Availability Set Karo
    @PostMapping
    public List<DoctorAvailability> setAvailability(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody DoctorAvailabilityRequest request) {
        String token = authHeader.substring(7);
        UUID doctorId = jwtService.extractUserId(token);
        return availabilityService.setAvailability(doctorId, request);
    }

    // ✅ Apni Availability Dekho
    @GetMapping
    public List<DoctorAvailability> getMyAvailability(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        UUID doctorId = jwtService.extractUserId(token);
        return availabilityService.getAvailability(doctorId);
    }

    // ✅ Kisi Bhi Doctor Ki Availability Dekho (Patients ke liye)
    @GetMapping("/{doctorId}")
    public List<DoctorAvailability> getDoctorAvailability(
            @PathVariable UUID doctorId) {
        return availabilityService.getAvailability(doctorId);
    }
}

