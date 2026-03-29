package com.survin.SurvinHealthCare.enquiry.service;

import com.survin.SurvinHealthCare.enquiry.dto.MedicineEnquiryRequest;
import com.survin.SurvinHealthCare.enquiry.entity.MedicineEnquiry;
import com.survin.SurvinHealthCare.enquiry.repository.MedicineEnquiryRepository;
import com.survin.SurvinHealthCare.medical.entity.MedicalEntity;
import com.survin.SurvinHealthCare.medical.repository.MedicalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicineEnquiryService {

    private final MedicineEnquiryRepository medicineEnquiryRepository;
    private final MedicalRepository medicalRepository;

    // DB mein save karo
    public MedicineEnquiry createEnquiry(UUID doctorId, MedicineEnquiryRequest request) {
        MedicineEnquiry enquiry = new MedicineEnquiry();
        enquiry.setDoctorId(doctorId);
        enquiry.setMedicalId(request.getMedicalId());
        enquiry.setMedicineId(request.getMedicineId());
        enquiry.setMessage(request.getMessage());
        return medicineEnquiryRepository.save(enquiry);
    }

    // WhatsApp link banao
    public String generateWhatsappLink(UUID medicalId, String message) {
        MedicalEntity medical = medicalRepository.findById(medicalId)
                .orElseThrow(() -> new RuntimeException("Medical store not found"));

        String phone = medical.getPhone();
        String encodedMessage = message.replace(" ", "%20");
        return "https://wa.me/" + phone + "?text=" + encodedMessage;
    }

    // Doctor ki enquiries
    public List<MedicineEnquiry> getMyEnquiries(UUID doctorId) {
        return medicineEnquiryRepository.findByDoctorId(doctorId);
    }

    // Medical store ki enquiries
    public List<MedicineEnquiry> getEnquiriesByMedical(UUID medicalId) {
        return medicineEnquiryRepository.findByMedicalId(medicalId);
    }
}
