package com.survin.SurvinHealthCare.patient.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/patient")
public class PatientImageController {

    private final String uploadDir =
            System.getProperty("user.dir") + "/uploads/patients/";

    @PostMapping("/upload-photo")
    public String uploadPatientPhoto(
            @RequestParam("file") MultipartFile file) throws IOException {

        // Folder banao agar exist na kare
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Unique file naam banao
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // File save karo
        File destination = new File(uploadDir + fileName);
        file.transferTo(destination.getAbsoluteFile());

        // Path return karo
        return "/uploads/patients/" + fileName;
    }
}