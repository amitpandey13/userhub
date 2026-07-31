package com.example.programming.Repositories;

import com.example.programming.entities.User;

import com.example.programming.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

    @Override
    Optional<User> findById(Integer integer);

    @Override
    List<User> findAll();

    Page<User> findByStatus(UserStatus status, Pageable pageable);



    Optional<User> findByEmail(String email);

    //searching -- srach bar
    List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name,
            String email

    );
    //for Admin dashboard
    long countByStatus(UserStatus status);

    long countByCreatedAtAfter(LocalDateTime dateTime);

    List<User> findTop5ByOrderByCreatedAtDesc();


    @Query("""
       SELECT MONTH(u.createdAt), COUNT(u)
       FROM User u
       GROUP BY MONTH(u.createdAt)
       ORDER BY MONTH(u.createdAt)
       """)
    List<Object[]> getMonthlyUsers();




}
