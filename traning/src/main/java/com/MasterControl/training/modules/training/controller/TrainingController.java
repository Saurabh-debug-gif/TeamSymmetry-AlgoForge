package com.sop.training.modules.training.controller;

import com.MasterControl.training.modules.training.entity.TrainingModule;
import com.sop.training.modules.training.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/training")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    // POST /training/assign
    @PostMapping("/assign")
    public TrainingModule assignTraining(@RequestBody TrainingModule module) {
        return trainingService.assignTraining(module);
    }

    // GET /training/status
    @GetMapping("/status")
    public List<TrainingModule> getTrainingStatus() {
        return trainingService.getAllTraining();
    }
}