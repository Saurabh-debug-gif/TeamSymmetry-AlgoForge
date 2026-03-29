package com.survin.SurvinHealthCare.prescription.controller;

import com.survin.SurvinHealthCare.prescription.dto.PrescriptionRequest;
import com.survin.SurvinHealthCare.prescription.dto.PrescriptionResponse;
import com.survin.SurvinHealthCare.prescription.entity.Prescription;
import com.survin.SurvinHealthCare.prescription.service.PrescriptionService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final JwtService jwtService;

    // ✅ Doctor — Prescription Likho
    @PostMapping
    public Prescription createPrescription(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PrescriptionRequest request) {
        String token = authHeader.substring(7);
        UUID doctorId = jwtService.extractUserId(token);
        return prescriptionService.createPrescription(doctorId, request);
    }

    // ✅ Patient — Apni Prescriptions
    @GetMapping("/my")
    public List<PrescriptionResponse> getMyPrescriptions(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        UUID patientId = jwtService.extractUserId(token);
        return prescriptionService.getPatientPrescriptions(patientId);
    }

    // ✅ Doctor — Apni Prescriptions
    @GetMapping("/doctor")
    public List<PrescriptionResponse> getDoctorPrescriptions(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        UUID doctorId = jwtService.extractUserId(token);
        return prescriptionService.getDoctorPrescriptions(doctorId);
    }

    // ✅ Appointment Ki Prescription
    @GetMapping("/appointment/{appointmentId}")
    public PrescriptionResponse getByAppointment(
            @PathVariable UUID appointmentId) {
        return prescriptionService.getByAppointment(appointmentId);
    }
}