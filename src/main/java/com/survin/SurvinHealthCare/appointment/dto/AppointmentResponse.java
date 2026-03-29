package com.survin.SurvinHealthCare.appointment.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
public class AppointmentResponse {


    private UUID id; //


    private UUID patientId;
    private UUID doctorId;
    private String patientName;
    private String doctorName;
    private String clinicName;
    private String clinicAddress;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String notes;           // Patient ka reason
    private String doctorDescription; // ← Doctor ka extra note
    private String patientPhone;
}