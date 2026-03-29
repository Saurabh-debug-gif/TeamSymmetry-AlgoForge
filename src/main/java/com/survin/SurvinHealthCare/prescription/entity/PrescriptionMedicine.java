package com.survin.SurvinHealthCare.prescription.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "prescription_medicines")
@Getter
@Setter
public class PrescriptionMedicine {

    @Id
    @GeneratedValue
    private UUID id;

    private String medicineName;
    private String dosage;    // "500mg"
    private String duration;  // "7 days"
    private String timing;    // "After meal"
}