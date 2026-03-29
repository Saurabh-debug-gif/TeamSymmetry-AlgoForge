package com.survin.SurvinHealthCare.enquiry.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "medicine_enquiries")
@Getter
@Setter
public class MedicineEnquiry {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID doctorId;
    private UUID medicalId;
    private UUID medicineId;
    private String message;
}