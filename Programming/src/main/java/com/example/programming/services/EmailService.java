package com.example.programming.services;

import com.example.programming.Repositories.OtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private OtpRepository otpRepository;

    public void sendOtpEmail(String toEmail, String otp) {

        logger.info("Preparing OTP email for {}", toEmail);

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(toEmail);

            message.setSubject("Password Reset OTP");

            message.setText(
                    "Hello,\n\n" +
                            "Your OTP for resetting your password is:\n\n" +
                            otp +
                            "\n\nThis OTP is valid for 5 minutes.\n\n" +
                            "If you didn't request this, please ignore this email."
            );

            mailSender.send(message);

            logger.info("OTP email sent successfully to {}", toEmail);

        } catch (MailException e) {

            logger.error(
                    "Failed to send OTP email to {}",
                    toEmail,
                    e
            );

            throw e;
        }
    }

}