package com.example.programming.controllers;


import com.example.programming.Repositories.RoleRepository;
import com.example.programming.Repositories.UserRepo;
import com.example.programming.entities.Role;
import com.example.programming.entities.User;
import com.example.programming.enums.RoleName;
import com.example.programming.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepository roleRepository;


    @Test
    void createCustomer() {

        Role role = new Role();
        role.setName(RoleName.ROLE_USER);

        roleRepository.save(role);
        User user = User.builder()
                .name("Amit")
                .email("amyyy@gmail.com")
                .password("Amit@123")
                .role(role)
                .build();

        User savedUser = userService.createUser(user);

        assertEquals(1, userRepo.count());
        assertNotNull(savedUser);
        assertEquals("Amit", savedUser.getName());
        assertEquals("amyyy@gmail.com", savedUser.getEmail());
        assertEquals(RoleName.ROLE_USER, savedUser.getRole().getName());
    }
}