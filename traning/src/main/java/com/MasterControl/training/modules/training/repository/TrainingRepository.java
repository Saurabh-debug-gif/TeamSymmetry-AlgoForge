package com.sop.training.modules.training.repository;

import com.MasterControl.training.modules.training.entity.TrainingModule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingRepository extends JpaRepository<TrainingModule, Long> {
}