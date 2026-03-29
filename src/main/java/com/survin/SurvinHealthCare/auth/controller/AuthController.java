package com.survin.SurvinHealthCare.auth.controller;

import com.survin.SurvinHealthCare.auth.dto.*;
import com.survin.SurvinHealthCare.auth.entity.Role;
import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.auth.entity.UserRole;
import com.survin.SurvinHealthCare.auth.repository.RoleRepository;
import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.auth.repository.UserRoleRepository;
import com.survin.SurvinHealthCare.auth.service.AuthService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("User registered successfully"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);

            // 🔥 Get user + role
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Role role = getUserRole(user);

            return ResponseEntity.ok(new AuthResponse(token, role.getName()));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(e.getMessage()));
        }
    }

    // ================= GOOGLE LOGIN =================
    @PostMapping("/google-login")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest body) {

        User user = userRepository.findByEmail(body.getEmail())
                .orElseGet(() -> createGoogleUser(body));

        Role role = getUserRole(user);

        String token = jwtService.generateToken(user, role.getName());

        return ResponseEntity.ok(new AuthResponse(token, role.getName()));
    }

    // ================= HELPER METHODS =================

    private User createGoogleUser(GoogleLoginRequest body) {
        User newUser = new User();
        newUser.setName(body.getName());
        newUser.setEmail(body.getEmail());
        newUser.setPassword(passwordEncoder.encode(body.getGoogleId()));

        userRepository.save(newUser);

        Role role = roleRepository.findByName("PATIENT")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        UserRole userRole = new UserRole();
        userRole.setUserId(newUser.getId());
        userRole.setRoleId(role.getId());

        userRoleRepository.save(userRole);

        return newUser;
    }

    private Role getUserRole(User user) {
        List<UserRole> roles = userRoleRepository.findByUserId(user.getId());

        if (roles.isEmpty()) {
            throw new RuntimeException("User role not found");
        }

        return roleRepository.findById(roles.get(0).getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }
}