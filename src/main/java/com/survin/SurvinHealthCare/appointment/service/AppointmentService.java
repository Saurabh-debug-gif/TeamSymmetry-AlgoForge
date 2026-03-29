package com.survin.SurvinHealthCare.appointment.service;

import com.survin.SurvinHealthCare.appointment.dto.AppointmentRequest;
import com.survin.SurvinHealthCare.appointment.dto.AppointmentResponse;
import com.survin.SurvinHealthCare.appointment.entity.Appointment;
import com.survin.SurvinHealthCare.appointment.repository.AppointmentRepository;
import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.doctor.profile.entity.DoctorProfile;
import com.survin.SurvinHealthCare.doctor.profile.repository.DoctorProfileRepository;
import com.survin.SurvinHealthCare.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final EmailService emailService;

    // ✅ Book Appointment
    public Appointment bookAppointment(UUID patientId, AppointmentRequest request) {

        DoctorProfile doctorProfile = doctorProfileRepository
                .findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);

        // ✅ ALWAYS store doctor USER ID
        appointment.setDoctorId(doctorProfile.getUserId());

        appointment.setStatus("PENDING");
        appointment.setNotes(request.getNotes());
        appointment.setPatientPhone(request.getPatientPhone());

        return appointmentRepository.save(appointment);
    }

    // Service mein updateAppointment signature update karo
    public Appointment updateAppointment(UUID appointmentId, UUID doctorId,
                                         LocalDate date, LocalTime time,
                                         String status, String description) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // ✅ Verify karo ki yeh doctor ka hi appointment hai
        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized — not your appointment");
        }

        if (date != null) appointment.setAppointmentDate(date);
        if (time != null) appointment.setAppointmentTime(time);
        if (status != null) appointment.setStatus(status);
        if (description != null) appointment.setDoctorDescription(description);

        appointmentRepository.save(appointment);

        // Email notifications
        User patient = userRepository.findById(appointment.getPatientId()).orElse(null);
        User doctor = userRepository.findById(appointment.getDoctorId()).orElse(null);
        DoctorProfile doctorProfile = doctorProfileRepository
                .findByUserId(appointment.getDoctorId()).orElse(null);

        if ("CONFIRMED".equals(status) && patient != null) {
            try {
                emailService.sendAppointmentConfirmation(
                        patient.getEmail(), patient.getName(),
                        doctor != null ? doctor.getName() : "Doctor",
                        date != null ? date.toString() : "TBD",
                        time != null ? time.toString() : "TBD",
                        doctorProfile != null ? doctorProfile.getClinicName() : "",
                        doctorProfile != null ? doctorProfile.getClinicAddress() : ""
                );
            } catch (Exception e) {
                System.out.println("Email failed: " + e.getMessage());
            }
        }

        if ("CANCELLED".equals(status) && patient != null) {
            try {
                emailService.sendAppointmentCancellation(
                        patient.getEmail(), patient.getName(),
                        doctor != null ? doctor.getName() : "Doctor",
                        date != null ? date.toString() : "TBD"
                );
            } catch (Exception e) {
                System.out.println("Email failed: " + e.getMessage());
            }
        }

        return appointment;
    }

    // ✅ Patient appointments
    public List<AppointmentResponse> getPatientAppointments(UUID patientId) {
        System.out.println("Fetching appointments for patient: " + patientId);

        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ✅ Doctor appointments
    public List<AppointmentResponse> getDoctorAppointments(UUID doctorUserId) {
        return appointmentRepository.findByDoctorId(doctorUserId)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ✅ Pending
    public List<AppointmentResponse> getPendingAppointments(UUID doctorUserId) {
        return appointmentRepository.findByDoctorIdAndStatus(doctorUserId, "PENDING")
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ✅ FIXED RESPONSE BUILDER
    private AppointmentResponse buildResponse(Appointment appointment) {

        AppointmentResponse response = new AppointmentResponse();

        response.setId(appointment.getId());
        response.setStatus(appointment.getStatus());
        response.setNotes(appointment.getNotes());
        response.setDoctorDescription(appointment.getDoctorDescription());
        response.setAppointmentDate(appointment.getAppointmentDate());
        response.setAppointmentTime(appointment.getAppointmentTime());
        response.setPatientPhone(appointment.getPatientPhone());

        // ✅ CRITICAL FIX (missing earlier)
        response.setPatientId(appointment.getPatientId());
        response.setDoctorId(appointment.getDoctorId());

        // Patient name
        userRepository.findById(appointment.getPatientId())
                .ifPresent(u -> response.setPatientName(u.getName()));

        // Doctor name
        userRepository.findById(appointment.getDoctorId())
                .ifPresent(u -> response.setDoctorName(u.getName()));

        // Clinic
        doctorProfileRepository.findByUserId(appointment.getDoctorId())
                .ifPresent(profile -> {
                    response.setClinicName(profile.getClinicName());
                    response.setClinicAddress(profile.getClinicAddress());
                });

        return response;
    }
}