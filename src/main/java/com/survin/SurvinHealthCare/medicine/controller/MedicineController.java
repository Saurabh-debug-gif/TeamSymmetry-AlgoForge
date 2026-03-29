package com.survin.SurvinHealthCare.medicine.controller;

import com.survin.SurvinHealthCare.medicine.entity.MedicineEntity;
import com.survin.SurvinHealthCare.medicine.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineRepository medicineRepository;

    @GetMapping
    public List<MedicineEntity> getAllMedicines() {
        return medicineRepository.findAll();
    }
}