package com.sop.training.modules.assessment.repository;

import com.MasterControl.training.modules.assessment.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
}