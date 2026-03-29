package com.survin.SurvinHealthCare.auth.dto;

import lombok.Data;

@Data
public class UserProfileResponse {

    private String id;
    private String name;
    private String email;
    private String phone;

}