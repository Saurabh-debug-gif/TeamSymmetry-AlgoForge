package com.survin.SurvinHealthCare.prescription.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class PrescriptionRequest {

    private UUID appointmentId;
    private UUID patientId;
    private String diagnosis;
    private String instructions;
    private List<MedicineItem> medicines;

    @Getter
    @Setter
    public static class MedicineItem {
        private String medicineName;
        private String dosage;
        private String duration;
        private String timing;
    }
}