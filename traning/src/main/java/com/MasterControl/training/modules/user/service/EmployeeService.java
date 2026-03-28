package com.sop.training.modules.user.service;

import com.MasterControl.training.modules.user.entity.Employee;
import com.sop.training.modules.user.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // CREATE
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // GET ALL
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // GET BY ID
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    // UPDATE
    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        Employee existing = getEmployeeById(id);

        existing.setName(updatedEmployee.getName());
        existing.setEmail(updatedEmployee.getEmail());
        existing.setRole(updatedEmployee.getRole());
        existing.setLanguage(updatedEmployee.getLanguage());
        existing.setBranch(updatedEmployee.getBranch());
        existing.setStatus(updatedEmployee.getStatus());

        return employeeRepository.save(existing);
    }
}