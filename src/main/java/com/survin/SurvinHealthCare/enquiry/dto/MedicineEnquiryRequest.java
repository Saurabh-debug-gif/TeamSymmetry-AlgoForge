package com.survin.SurvinHealthCare.enquiry.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class MedicineEnquiryRequest {
    private UUID medicalId;
    private UUID medicineId;
    private String message;
}