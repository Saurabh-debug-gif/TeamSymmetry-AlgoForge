package com.survin.SurvinHealthCare.appointment.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class AppointmentRequest {

    private UUID doctorId;
    private String notes;
    private String patientPhone; // SMS ke liye
}