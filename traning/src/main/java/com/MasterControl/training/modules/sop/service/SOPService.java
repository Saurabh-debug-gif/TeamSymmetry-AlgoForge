package com.sop.training.modules.sop.service;

import com.MasterControl.training.modules.sop.entity.SOPDocument;
import com.sop.training.modules.sop.repository.SOPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SOPService {

    @Autowired
    private SOPRepository sopRepository;

    // CREATE SOP
    public SOPDocument createSOP(SOPDocument sop) {
        sop.setCreatedAt(LocalDateTime.now());
        return sopRepository.save(sop);
    }

    // GET ALL
    public List<SOPDocument> getAllSOPs() {
        return sopRepository.findAll();
    }

    // UPDATE VERSION
    public SOPDocument updateVersion(Long id, String version) {
        SOPDocument sop = sopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SOP not found"));

        sop.setVersion(version);
        return sopRepository.save(sop);
    }
}