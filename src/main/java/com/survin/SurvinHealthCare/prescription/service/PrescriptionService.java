package com.survin.SurvinHealthCare.prescription.service;

import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.prescription.dto.PrescriptionRequest;
import com.survin.SurvinHealthCare.prescription.dto.PrescriptionResponse;
import com.survin.SurvinHealthCare.prescription.entity.Prescription;
import com.survin.SurvinHealthCare.prescription.entity.PrescriptionMedicine;
import com.survin.SurvinHealthCare.prescription.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;

    // ✅ Doctor — Prescription Likho
    public Prescription createPrescription(UUID doctorId,
                                           PrescriptionRequest request) {
        Prescription prescription = new Prescription();
        prescription.setDoctorId(doctorId);
        prescription.setPatientId(request.getPatientId());
        prescription.setAppointmentId(request.getAppointmentId());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setInstructions(request.getInstructions());

        // Medicines add karo
        List<PrescriptionMedicine> medicines = request.getMedicines()
                .stream()
                .map(item -> {
                    PrescriptionMedicine med = new PrescriptionMedicine();
                    med.setMedicineName(item.getMedicineName());
                    med.setDosage(item.getDosage());
                    med.setDuration(item.getDuration());
                    med.setTiming(item.getTiming());
                    return med;
                })
                .collect(Collectors.toList());

        prescription.setMedicines(medicines);
        return prescriptionRepository.save(prescription);
    }

    // ✅ Patient — Apni Prescriptions Dekho
    public List<PrescriptionResponse> getPatientPrescriptions(UUID patientId) {
        return prescriptionRepository.findByPatientId(patientId)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ✅ Doctor — Apni Prescriptions Dekho
    public List<PrescriptionResponse> getDoctorPrescriptions(UUID doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ✅ Appointment Ki Prescription
    public PrescriptionResponse getByAppointment(UUID appointmentId) {
        Prescription prescription = prescriptionRepository
                .findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        return buildResponse(prescription);
    }

    // ✅ Helper
    private PrescriptionResponse buildResponse(Prescription prescription) {
        PrescriptionResponse response = new PrescriptionResponse();
        response.setId(prescription.getId());
        response.setDiagnosis(prescription.getDiagnosis());
        response.setInstructions(prescription.getInstructions());

        // Doctor naam
        userRepository.findById(prescription.getDoctorId())
                .ifPresent(u -> response.setDoctorName(u.getName()));

        // Patient naam
        userRepository.findById(prescription.getPatientId())
                .ifPresent(u -> response.setPatientName(u.getName()));

        // Medicines
        List<PrescriptionResponse.MedicineDetail> details = prescription.getMedicines()
                .stream()
                .map(med -> {
                    PrescriptionResponse.MedicineDetail detail =
                            new PrescriptionResponse.MedicineDetail();
                    detail.setMedicineName(med.getMedicineName());
                    detail.setDosage(med.getDosage());
                    detail.setDuration(med.getDuration());
                    detail.setTiming(med.getTiming());
                    return detail;
                })
                .collect(Collectors.toList());

        response.setMedicines(details);
        return response;
    }
}