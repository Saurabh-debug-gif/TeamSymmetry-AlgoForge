package com.survin.SurvinHealthCare.admin.controller;

import com.survin.SurvinHealthCare.admin.dto.AdminStatsResponse;
import com.survin.SurvinHealthCare.admin.service.AdminService;
import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.doctor.profile.entity.DoctorProfile;
import com.survin.SurvinHealthCare.medical.entity.MedicalEntity;
import com.survin.SurvinHealthCare.medicine.entity.MedicineEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ✅ Stats
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // ✅ All Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // ✅ Delete User
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(adminService.deleteUser(userId));
    }

    // ✅ Block User
    @PutMapping("/users/{userId}/block")
    public ResponseEntity<String> blockUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(adminService.blockUser(userId));
    }

    // ✅ Unblock User
    @PutMapping("/users/{userId}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(adminService.unblockUser(userId));
    }

    // ✅ All Doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorProfile>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    // ✅ Verify Doctor
    @PutMapping("/doctors/{doctorId}/verify")
    public ResponseEntity<String> verifyDoctor(@PathVariable UUID doctorId) {
        return ResponseEntity.ok(adminService.verifyDoctor(doctorId));
    }

    // ✅ All Patients
    @GetMapping("/patients")
    public ResponseEntity<?> getAllPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    // =====================
    // MEDICALS CRUD
    // =====================
    @GetMapping("/medicals")
    public ResponseEntity<List<MedicalEntity>> getAllMedicals() {
        return ResponseEntity.ok(adminService.getAllMedicals());
    }

    @PostMapping("/medicals")
    public ResponseEntity<MedicalEntity> addMedical(
            @RequestBody MedicalEntity medical) {
        return ResponseEntity.ok(adminService.saveMedical(medical));
    }

    @PutMapping("/medicals/{id}")
    public ResponseEntity<MedicalEntity> updateMedical(
            @PathVariable UUID id,
            @RequestBody MedicalEntity medical) {
        medical.setId(id);
        return ResponseEntity.ok(adminService.saveMedical(medical));
    }

    @DeleteMapping("/medicals/{id}")
    public ResponseEntity<String> deleteMedical(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.deleteMedical(id));
    }

    // =====================
    // MEDICINES CRUD
    // =====================
    @GetMapping("/medicines")
    public ResponseEntity<List<MedicineEntity>> getAllMedicines() {
        return ResponseEntity.ok(adminService.getAllMedicines());
    }

    @PostMapping("/medicines")
    public ResponseEntity<MedicineEntity> addMedicine(
            @RequestBody MedicineEntity medicine) {
        return ResponseEntity.ok(adminService.saveMedicine(medicine));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<MedicineEntity> updateMedicine(
            @PathVariable UUID id,
            @RequestBody MedicineEntity medicine) {
        medicine.setId(id);
        return ResponseEntity.ok(adminService.saveMedicine(medicine));
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.deleteMedicine(id));
    }
}