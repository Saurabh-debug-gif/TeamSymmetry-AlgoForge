package com.survin.SurvinHealthCare.enquiry.controller;

import com.survin.SurvinHealthCare.enquiry.dto.MedicineEnquiryRequest;
import com.survin.SurvinHealthCare.enquiry.entity.MedicineEnquiry;
import com.survin.SurvinHealthCare.enquiry.service.MedicineEnquiryService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enquiry")
@RequiredArgsConstructor
public class MedicineEnquiryController {

    private final MedicineEnquiryService medicineEnquiryService;
    private final JwtService jwtService;

    @PostMapping
    public String createEnquiry(                          // ← String return karega ab
                                                          @RequestHeader("Authorization") String authHeader,
                                                          @RequestBody MedicineEnquiryRequest request) {

        String token = authHeader.substring(7);
        UUID doctorId = jwtService.extractUserId(token);

        // Step 1 — DB mein save karo
        medicineEnquiryService.createEnquiry(doctorId, request);

        // Step 2 — WhatsApp link return karo
        return medicineEnquiryService.generateWhatsappLink(
                request.getMedicalId(),
                request.getMessage()
        );
    }

    @GetMapping("/my")
    public List<MedicineEnquiry> getMyEnquiries(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        UUID doctorId = jwtService.extractUserId(token);
        return medicineEnquiryService.getMyEnquiries(doctorId);
    }

    @GetMapping("/medical/{medicalId}")
    public List<MedicineEnquiry> getByMedical(@PathVariable UUID medicalId) {
        return medicineEnquiryService.getEnquiriesByMedical(medicalId);
    }
}