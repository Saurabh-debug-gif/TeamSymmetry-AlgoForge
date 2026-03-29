package com.survin.SurvinHealthCare.doctor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DoctorController {

    @GetMapping("/api/doctor/test")
    public String test(){
        return "Doctor API working";
    }
}