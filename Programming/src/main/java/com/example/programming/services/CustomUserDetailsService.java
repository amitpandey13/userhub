package com.example.programming.services;

import com.example.programming.entities.User;
import com.example.programming.Repositories.UserRepo;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {


    private final UserRepo userRepository;


    public CustomUserDetailsService(UserRepo userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {


        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new UsernameNotFoundException(
                                "User not found"
                        )
                );


        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),

                Collections.singleton(
                        new SimpleGrantedAuthority(
                                user.getRole()
                                        .getName()
                                        .name()
                        )
                )
        );
    }
}
