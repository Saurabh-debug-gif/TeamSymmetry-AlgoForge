package com.survin.SurvinHealthCare.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String name;
    private String email;
    private String phone;
    private String password;
    private String role;

}