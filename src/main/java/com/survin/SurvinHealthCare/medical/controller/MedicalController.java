package com.survin.SurvinHealthCare.medical.controller;

import com.survin.SurvinHealthCare.medical.entity.MedicalEntity;
import com.survin.SurvinHealthCare.medical.repository.MedicalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicals")
@RequiredArgsConstructor
public class MedicalController {

    private final MedicalRepository medicalRepository;

    @GetMapping
    public List<MedicalEntity> getAllMedicals() {
        return medicalRepository.findAll();
    }
}