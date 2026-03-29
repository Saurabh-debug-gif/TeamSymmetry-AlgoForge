package com.survin.SurvinHealthCare.ai.controller;

import com.survin.SurvinHealthCare.ai.entity.sop;
import com.survin.SurvinHealthCare.ai.repository.sopRepository;
import com.survin.SurvinHealthCare.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;
    private final sopRepository sopRepository;

    // ✅ PROCESS SOP
    @PostMapping("/process-sop")
    public ResponseEntity<?> processSop(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(aiService.processSop(file));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // ✅ GET ALL SOP
    @GetMapping("/all")
    public List<sop> getAllSop() {
        return sopRepository.findAll();
    }
}