package com.example.programming.services;

import com.example.programming.dto.ChangePasswordRequest;
import com.example.programming.dto.UpdateProfileRequest;
import com.example.programming.dto.UpdateUserRequest;
import com.example.programming.dto.UserDto;
import com.example.programming.entities.User;
import com.example.programming.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface UserService {

    User createUser(User user);
//    List<User> getAllUsers();

    boolean emailExists(String email);

    Page<User> getAllUsers(int page, int size, UserStatus Status);

    void deleteById(int id);

    void restoreById(int id);
    User updateUserData(int id, User user);

    User login(User user);

    void updatePassword(String email, String password);

    List<User> searchUsers(String keyword);

    UserDto getCurrentUser();

    UserDto updateCurrentUser(UpdateUserRequest request);

    void changePassword(ChangePasswordRequest request);
    UserDto uploadProfilePicture(MultipartFile file);

    UserDto deleteProfilePicture();
    UserDto updateProfile(UpdateProfileRequest request);



}
