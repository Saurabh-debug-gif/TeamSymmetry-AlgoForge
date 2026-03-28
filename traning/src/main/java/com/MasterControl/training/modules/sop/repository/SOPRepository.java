package com.sop.training.modules.sop.repository;

import com.MasterControl.training.modules.sop.entity.SOPDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SOPRepository extends JpaRepository<SOPDocument, Long> {
}