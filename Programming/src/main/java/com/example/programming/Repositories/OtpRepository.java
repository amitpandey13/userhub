package com.example.programming.Repositories;

import com.example.programming.entities.Otp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp,Integer> {

    Optional<Otp> findByEmail(String email);

    void deleteByEmail(String email);

    Optional<Otp> findByEmailAndOtp(String email, String otp);

}
