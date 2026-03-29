package com.survin.SurvinHealthCare.admin.controller;

import com.survin.SurvinHealthCare.appointment.repository.AppointmentRepository;
import com.survin.SurvinHealthCare.doctor.profile.repository.DoctorProfileRepository;
import com.survin.SurvinHealthCare.patient.repository.PatientProfileRepository;
import com.survin.SurvinHealthCare.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicStatsController {

    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final ReviewRepository reviewRepository;

    // ✅ Public — No auth required
    @GetMapping("/stats")
    public Map<String, Object> getPublicStats() {
        Map<String, Object> stats = new HashMap<>();

        // ✅ Verified doctors count
        stats.put("verifiedDoctors",
                doctorProfileRepository.countByIsVerified(true));

        // ✅ Total patients
        stats.put("totalPatients",
                patientProfileRepository.count());

        // ✅ Total appointments
        stats.put("totalAppointments",
                appointmentRepository.count());

        // ✅ Average rating
        Double avgRating = reviewRepository.findAverageRating();
        stats.put("averageRating",
                avgRating != null
                        ? Math.round(avgRating * 10.0) / 10.0
                        : 4.9);

        return stats;
    }
}