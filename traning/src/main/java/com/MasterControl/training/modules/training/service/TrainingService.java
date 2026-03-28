package com.sop.training.modules.training.service;

import com.MasterControl.training.modules.training.entity.TrainingModule;
import com.sop.training.modules.training.repository.TrainingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrainingService {

    @Autowired
    private TrainingRepository trainingRepository;

    // ASSIGN SOP TO EMPLOYEE
    public TrainingModule assignTraining(TrainingModule module) {
        module.setAssignedDate(LocalDateTime.now());
        module.setCompletionStatus("PENDING");
        return trainingRepository.save(module);
    }

    // MARK COMPLETION
    public TrainingModule markCompleted(Long id) {
        TrainingModule module = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        module.setCompletionStatus("COMPLETED");
        return trainingRepository.save(module);
    }

    // GET ALL
    public List<TrainingModule> getAllTraining() {
        return trainingRepository.findAll();
    }
}