package com.survin.SurvinHealthCare.doctor.availability.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class DoctorAvailabilityRequest {

    private List<DaySchedule> schedule; // ← Yeh hai?

    @Getter  // ← Yeh zaruri hai!
    @Setter  // ← Yeh bhi!
    public static class DaySchedule {
        private String dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
        private Boolean isAvailable;
    }
}