package com.survin.SurvinHealthCare.auth.entity;

import com.survin.SurvinHealthCare.common.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {
    private Boolean isBlocked = false;
    private String name;

    @Column(unique = true)
    private String email;

    private String phone;

    private String password;

    @Column(name = "is_active")
    private boolean isActive = true;


}