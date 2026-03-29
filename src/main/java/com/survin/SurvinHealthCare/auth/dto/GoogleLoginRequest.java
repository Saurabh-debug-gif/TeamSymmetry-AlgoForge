package com.survin.SurvinHealthCare.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleLoginRequest {
    private String email;
    private String name;
    private String googleId;
}