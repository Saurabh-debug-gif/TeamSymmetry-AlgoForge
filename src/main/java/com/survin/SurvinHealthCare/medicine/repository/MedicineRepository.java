package com.survin.SurvinHealthCare.medicine.repository;

import com.survin.SurvinHealthCare.medicine.entity.MedicineEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MedicineRepository extends JpaRepository<MedicineEntity, UUID> {}