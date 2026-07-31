package com.example.programming.services;

import com.example.programming.Repositories.OtpRepository;
import com.example.programming.entities.Otp;
import com.example.programming.exception.InvalidOtpException;
import com.example.programming.exception.OtpExpiredException;
import com.example.programming.exception.OtpNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    private static final Logger logger =
            LoggerFactory.getLogger(OtpService.class);

    @Autowired
    private OtpRepository otpRepository;

    /**
     * Generate a random 6-digit OTP
     */
    public String generateOtp() {

        logger.info("Generating OTP.");

        Random random = new Random();

        String generatedOtp = String.valueOf(
                100000 + random.nextInt(900000)
        );

        logger.debug("OTP generated successfully.");

        return generatedOtp;
    }

    /**
     * Save OTP
     */
    public void saveOtp(String email, String otp) {

        logger.info("Saving OTP for email: {}", email);

        // Delete old OTP if present
        otpRepository.findByEmail(email)
                .ifPresent(existingOtp -> {

                    logger.debug("Existing OTP found. Deleting old OTP for {}", email);

                    otpRepository.delete(existingOtp);

                });

        Otp otpEntity = new Otp();

        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);

        otpEntity.setExpiryTime(
                LocalDateTime.now().plusMinutes(5)
        );

        otpRepository.save(otpEntity);

        logger.info("OTP saved successfully for {}", email);
    }

    /**
     * Find OTP by email
     */
    public Optional<Otp> getOtp(String email) {

        logger.debug("Fetching OTP for {}", email);

        return otpRepository.findByEmail(email);
    }

    /**
     * Check expiry
     */
    public boolean isExpired(Otp otp) {

        return otp.getExpiryTime()
                .isBefore(LocalDateTime.now());
    }

    /**
     * Delete OTP
     */
    public void deleteOtp(String email) {

        logger.info("Deleting OTP for {}", email);

        otpRepository.findByEmail(email)
                .ifPresent(otpRepository::delete);

        logger.debug("OTP deleted successfully for {}", email);
    }

    /**
     * Verify OTP
     */
    public boolean verifyOtp(String email, String otp) {

        logger.info("OTP verification requested for {}", email);

        Otp savedOtp = otpRepository.findByEmail(email)
                .orElseThrow(() -> {

                    logger.warn("OTP not found for {}", email);

                    return new OtpNotFoundException(
                            "OTP not found"
                    );

                });

        if (isExpired(savedOtp)) {

            logger.warn("Expired OTP for {}", email);

            otpRepository.delete(savedOtp);

            throw new OtpExpiredException(
                    "OTP Expired"
            );
        }

        if (!savedOtp.getOtp().equals(otp)) {

            logger.warn("Invalid OTP entered for {}", email);

            throw new InvalidOtpException(
                    "Invalid OTP"
            );
        }

        logger.info("OTP verified successfully for {}", email);

        return true;
    }
}