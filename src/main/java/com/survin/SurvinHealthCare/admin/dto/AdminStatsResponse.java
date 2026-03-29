package com.survin.SurvinHealthCare.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminStatsResponse {
    private long totalUsers;
    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long pendingAppointments;
    private long totalReviews;
    private long totalMedicals;   // ← New
    private long totalMedicines;  // ← New
}