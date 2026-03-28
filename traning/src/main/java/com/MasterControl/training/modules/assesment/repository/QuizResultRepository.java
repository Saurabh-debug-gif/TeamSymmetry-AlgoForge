package com.sop.training.modules.assessment.repository;

import com.MasterControl.training.modules.assessment.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
}