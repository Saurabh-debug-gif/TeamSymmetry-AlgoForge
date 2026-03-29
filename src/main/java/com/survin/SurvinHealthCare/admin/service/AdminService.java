package com.survin.SurvinHealthCare.admin.service;

import com.survin.SurvinHealthCare.admin.dto.AdminStatsResponse;
import com.survin.SurvinHealthCare.appointment.repository.AppointmentRepository;
import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.auth.repository.UserRoleRepository;
import com.survin.SurvinHealthCare.doctor.profile.entity.DoctorProfile;
import com.survin.SurvinHealthCare.doctor.profile.repository.DoctorProfileRepository;
import com.survin.SurvinHealthCare.medical.entity.MedicalEntity;
import com.survin.SurvinHealthCare.medical.repository.MedicalRepository;
import com.survin.SurvinHealthCare.medicine.entity.MedicineEntity;
import com.survin.SurvinHealthCare.medicine.repository.MedicineRepository;
import com.survin.SurvinHealthCare.patient.entity.PatientProfile;
import com.survin.SurvinHealthCare.patient.repository.PatientProfileRepository;
import com.survin.SurvinHealthCare.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository; // ← MISSING THI!
    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final ReviewRepository reviewRepository;
    private final MedicalRepository medicalRepository;
    private final MedicineRepository medicineRepository;

    // ✅ Stats
    public AdminStatsResponse getStats() {
        AdminStatsResponse stats = new AdminStatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalDoctors(doctorProfileRepository.count());
        stats.setTotalPatients(patientProfileRepository.count());
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setPendingAppointments(
                appointmentRepository.countByStatus("PENDING"));
        stats.setTotalReviews(reviewRepository.count());
        stats.setTotalMedicals(medicalRepository.count());
        stats.setTotalMedicines(medicineRepository.count());
        return stats;
    }

    // ✅ All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Delete User — Proper Order Mein
    @Transactional
    public String deleteUser(UUID userId) {
        try {
            // Step 1 — UserRole delete karo
            userRoleRepository.deleteByUserId(userId);

            // Step 2 — Doctor profile delete karo
            doctorProfileRepository.findByUserId(userId)
                    .ifPresent(doctorProfileRepository::delete);

            // Step 3 — Patient profile delete karo
            patientProfileRepository.findByUserId(userId)
                    .ifPresent(patientProfileRepository::delete);

            // Step 4 — Appointments delete karo
            appointmentRepository.deleteByPatientId(userId);
            appointmentRepository.deleteByDoctorId(userId);

            // Step 5 — User delete karo
            userRepository.deleteById(userId);

            return "User deleted!";
        } catch (Exception e) {
            throw new RuntimeException("Delete failed: " + e.getMessage());
        }
    }

    // ✅ Block User
    public String blockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsBlocked(true);
        userRepository.save(user);
        return "User blocked!";
    }

    // ✅ Unblock User
    public String unblockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsBlocked(false);
        userRepository.save(user);
        return "User unblocked!";
    }

    // ✅ All Doctors
    public List<DoctorProfile> getAllDoctors() {
        return doctorProfileRepository.findAll();
    }

    // ✅ Verify Doctor
    public String verifyDoctor(UUID doctorProfileId) {
        DoctorProfile profile = doctorProfileRepository.findById(doctorProfileId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        profile.setIsVerified(true);
        doctorProfileRepository.save(profile);
        return "Doctor verified!";
    }

    // ✅ All Patients
    public List<PatientProfile> getAllPatients() {
        return patientProfileRepository.findAll();
    }

    // =====================
    // MEDICALS CRUD
    // =====================
    public List<MedicalEntity> getAllMedicals() {
        return medicalRepository.findAll();
    }

    public MedicalEntity saveMedical(MedicalEntity medical) {
        return medicalRepository.save(medical);
    }

    public String deleteMedical(UUID id) {
        medicalRepository.deleteById(id);
        return "Medical store deleted!";
    }

    // =====================
    // MEDICINES CRUD
    // =====================
    public List<MedicineEntity> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public MedicineEntity saveMedicine(MedicineEntity medicine) {
        return medicineRepository.save(medicine);
    }

    public String deleteMedicine(UUID id) {
        medicineRepository.deleteById(id);
        return "Medicine deleted!";
    }
}