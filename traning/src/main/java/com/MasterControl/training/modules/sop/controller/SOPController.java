package com.sop.training.modules.sop.controller;

import com.MasterControl.training.modules.sop.entity.SOPDocument;
import com.sop.training.modules.sop.service.SOPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sop")
public class SOPController {

    @Autowired
    private SOPService sopService;

    // POST /sop
    @PostMapping
    public SOPDocument createSOP(@RequestBody SOPDocument sop) {
        return sopService.createSOP(sop);
    }

    // GET /sop
    @GetMapping
    public List<SOPDocument> getAllSOPs() {
        return sopService.getAllSOPs();
    }

    // GET /sop/{id}
    @GetMapping("/{id}")
    public SOPDocument getSOPById(@PathVariable Long id) {
        return sopService.getAllSOPs()
                .stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("SOP not found"));
    }
}