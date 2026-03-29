package com.survin.SurvinHealthCare.auth.service;

import com.survin.SurvinHealthCare.auth.dto.LoginRequest;
import com.survin.SurvinHealthCare.auth.dto.RegisterRequest;
import com.survin.SurvinHealthCare.auth.entity.Role;
import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.auth.entity.UserRole;
import com.survin.SurvinHealthCare.auth.repository.RoleRepository;
import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.auth.repository.UserRoleRepository;
import com.survin.SurvinHealthCare.notification.service.EmailService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService; // ✅ Add kiya

    // =========================
    // REGISTER USER
    // =========================
    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        UserRole userRole = new UserRole();
        userRole.setUserId(user.getId());
        userRole.setRoleId(role.getId());

        userRoleRepository.save(userRole);

        // ✅ Welcome Email Bhejo
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());
    }

    // =========================
    // LOGIN USER
    // =========================
    public String login(LoginRequest request) {

        // STEP 1: find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // STEP 2: password check
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // STEP 3: get user role mapping
        List<UserRole> roles = userRoleRepository.findByUserId(user.getId());

        if (roles.isEmpty()) {
            throw new RuntimeException("User role not found");
        }

        UserRole userRole = roles.get(0);

        // STEP 4: fetch role
        Role role = roleRepository.findById(userRole.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // STEP 5: generate JWT
        return jwtService.generateToken(user, role.getName());
    }
}