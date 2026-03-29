package com.survin.SurvinHealthCare.appointment.controller;

import com.survin.SurvinHealthCare.appointment.dto.AppointmentRequest;
import com.survin.SurvinHealthCare.appointment.dto.AppointmentResponse;
import com.survin.SurvinHealthCare.appointment.entity.Appointment;
import com.survin.SurvinHealthCare.appointment.service.AppointmentService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final JwtService jwtService;

    private String extractToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }
        return authHeader.substring(7);
    }

    // ✅ Patient — Book appointment
    @PostMapping
    public ResponseEntity<?> bookAppointment(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AppointmentRequest request) {
        try {
            String token = extractToken(authHeader);
            UUID patientId = jwtService.extractUserId(token);
            Appointment appointment = appointmentService.bookAppointment(patientId, request);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Booking failed: " + e.getMessage());
        }
    }

    // ✅ Doctor — Update appointment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time,
            @RequestParam(required = false) String description) {
        try {
            String token = extractToken(authHeader);
            UUID doctorId = jwtService.extractUserId(token);
            Appointment appointment = appointmentService.updateAppointment(
                    id, doctorId, date, time, status, description);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Update failed: " + e.getMessage());
        }
    }

    // ✅ Patient — My appointments
    @GetMapping("/my")
    public ResponseEntity<?> getMyAppointments(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            UUID patientId = jwtService.extractUserId(token);
            List<AppointmentResponse> appointments =
                    appointmentService.getPatientAppointments(patientId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(List.of());
        }
    }

    // ✅ Doctor — All appointments
    @GetMapping("/doctor")
    public ResponseEntity<?> getDoctorAppointments(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            UUID doctorId = jwtService.extractUserId(token);
            List<AppointmentResponse> appointments =
                    appointmentService.getDoctorAppointments(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(List.of());
        }
    }

    // ✅ Doctor — Pending only
    @GetMapping("/doctor/pending")
    public ResponseEntity<?> getPendingAppointments(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            UUID doctorId = jwtService.extractUserId(token);
            List<AppointmentResponse> appointments =
                    appointmentService.getPendingAppointments(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(List.of());
        }
    }
}