package com.example.programming.Repositories;

import com.example.programming.entities.Role;
import com.example.programming.entities.User;
import com.example.programming.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(RoleName name);

}