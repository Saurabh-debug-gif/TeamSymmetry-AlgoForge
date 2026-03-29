package com.survin.SurvinHealthCare.enquiry.repository;

import com.survin.SurvinHealthCare.enquiry.entity.MedicineEnquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MedicineEnquiryRepository extends JpaRepository<MedicineEnquiry, UUID> {
    List<MedicineEnquiry> findByDoctorId(UUID doctorId);
    List<MedicineEnquiry> findByMedicalId(UUID medicalId);
}