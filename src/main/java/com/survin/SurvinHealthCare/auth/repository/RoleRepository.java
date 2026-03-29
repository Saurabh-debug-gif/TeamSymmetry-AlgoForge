package com.survin.SurvinHealthCare.auth.repository;

import com.survin.SurvinHealthCare.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

}