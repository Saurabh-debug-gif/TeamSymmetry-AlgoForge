package com.survin.SurvinHealthCare.auth.repository;

import com.survin.SurvinHealthCare.auth.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {

    // ✅ List return karo — Optional nahi!
    List<UserRole> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);

}