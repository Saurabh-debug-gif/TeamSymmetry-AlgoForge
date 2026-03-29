package com.survin.SurvinHealthCare.admin;

import com.survin.SurvinHealthCare.auth.entity.Role;
import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.auth.entity.UserRole;
import com.survin.SurvinHealthCare.auth.repository.RoleRepository;
import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.auth.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ application.properties se values aayengi
    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.name}")
    private String adminName;

    @Override
    public void run(String... args) {

        // ✅ Already exist karta hai toh skip
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            System.out.println("✅ Admin already exists — skipping");
            return;
        }

        // ✅ Admin User banao
        User admin = new User();
        admin.setName(adminName);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setIsBlocked(false);
        userRepository.save(admin);

        // ✅ ADMIN role fetch karo
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException(
                        "ADMIN role not found! Add it to roles table."
                ));

        // ✅ UserRole assign karo
        UserRole userRole = new UserRole();
        userRole.setUserId(admin.getId());
        userRole.setRoleId(adminRole.getId());
        userRoleRepository.save(userRole);

        System.out.println("=================================");
        System.out.println("✅ Admin created from .env!");
        System.out.println("📧 Email:    " + adminEmail);
        System.out.println("🔑 Password: " + adminPassword);
        System.out.println("=================================");
    }
}
