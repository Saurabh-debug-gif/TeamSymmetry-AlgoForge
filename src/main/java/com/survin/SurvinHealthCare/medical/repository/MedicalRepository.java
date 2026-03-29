package com.survin.SurvinHealthCare.medical.repository;

import com.survin.SurvinHealthCare.medical.entity.MedicalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MedicalRepository extends JpaRepository<MedicalEntity, UUID> {}