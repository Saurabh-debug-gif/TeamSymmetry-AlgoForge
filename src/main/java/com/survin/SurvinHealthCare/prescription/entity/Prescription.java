package com.survin.SurvinHealthCare.prescription.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
public class Prescription {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID appointmentId;
    private UUID doctorId;
    private UUID patientId;
    private String diagnosis;
    private String instructions;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "prescription_id")
    private List<PrescriptionMedicine> medicines;
}