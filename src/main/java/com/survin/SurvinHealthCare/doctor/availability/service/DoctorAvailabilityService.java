package com.survin.SurvinHealthCare.doctor.availability.service;

import com.survin.SurvinHealthCare.doctor.availability.dto.DoctorAvailabilityRequest;
import com.survin.SurvinHealthCare.doctor.availability.entity.DoctorAvailability;
import com.survin.SurvinHealthCare.doctor.availability.repository.DoctorAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;

    // ✅ Availability Set Karo
    @Transactional
    public List<DoctorAvailability> setAvailability(
            UUID doctorId,
            DoctorAvailabilityRequest request) {

        // Pehle purani availability delete karo
        availabilityRepository.deleteByDoctorId(doctorId);

        // Nayi availability save karo
        List<DoctorAvailability> availabilities = request.getSchedule()
                .stream()
                .map(schedule -> {
                    DoctorAvailability availability = new DoctorAvailability();
                    availability.setDoctorId(doctorId);
                    availability.setDayOfWeek(schedule.getDayOfWeek());
                    availability.setStartTime(schedule.getStartTime());
                    availability.setEndTime(schedule.getEndTime());
                    availability.setIsAvailable(schedule.getIsAvailable());
                    return availability;
                })
                .collect(Collectors.toList());

        return availabilityRepository.saveAll(availabilities);
    }

    // ✅ Availability Get Karo
    public List<DoctorAvailability> getAvailability(UUID doctorId) {
        return availabilityRepository.findByDoctorId(doctorId);
    }
}