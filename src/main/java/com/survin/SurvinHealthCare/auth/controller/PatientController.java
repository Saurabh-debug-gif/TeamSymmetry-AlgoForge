package com.survin.SurvinHealthCare.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patient")
public class PatientController {
    @GetMapping("/test")
    public String test(){
        return "Patient API working";
    }
}
