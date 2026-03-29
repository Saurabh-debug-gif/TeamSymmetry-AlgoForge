package com.survin.SurvinHealthCare.auth.service;

import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}