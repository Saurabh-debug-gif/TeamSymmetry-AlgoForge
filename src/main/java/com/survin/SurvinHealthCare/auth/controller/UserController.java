package com.survin.SurvinHealthCare.auth.controller;

import com.survin.SurvinHealthCare.auth.dto.UserProfileResponse;
import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.auth.service.UserService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final JwtService jwtService;
    private final UserService userService;

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(HttpServletRequest request){

        String authHeader = request.getHeader("Authorization");

        String token = authHeader.substring(7);

        String email = jwtService.extractEmail(token);

        User user = userService.getUserByEmail(email);

        UserProfileResponse response = new UserProfileResponse();

        response.setId(user.getId().toString());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());

        return response;
    }}