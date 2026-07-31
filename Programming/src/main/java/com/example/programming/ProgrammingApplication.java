package com.example.programming;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ProgrammingApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProgrammingApplication.class, args);
    }

}
