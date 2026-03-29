

package com.survin.SurvinHealthCare.prescription.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class PrescriptionResponse {

    private UUID id;
    private String doctorName;
    private String patientName;
    private String diagnosis;
    private String instructions;
    private List<MedicineDetail> medicines;

    @Getter
    @Setter
    public static class MedicineDetail {
        private String medicineName;
        private String dosage;
        private String duration;
        private String timing;
    }
}