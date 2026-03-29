package com.survin.SurvinHealthCare.appointment.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentUpdateRequest {

    private LocalDate date;
    private LocalTime time;
    private String status;
    private String description;
}