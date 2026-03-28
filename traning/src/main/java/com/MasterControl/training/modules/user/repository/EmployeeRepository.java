package com.sop.training.modules.user.repository;

import com.MasterControl.training.modules.user.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}