package com.example.programming.controllers;

import com.example.programming.dto.*;
import com.example.programming.entities.User;
import com.example.programming.serviceImplementation.UserServiceImplementation;
import com.example.programming.services.AuthenticationService;

import com.example.programming.services.NotificationService;
import com.example.programming.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.hibernate.dialect.function.json.JsonPathHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import static tools.jackson.databind.type.LogicalType.Map;

@Tag(
        name = "User Management",
        description = "CRUD operations for Users"
)
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private final AuthenticationService authenticationService;

    @Autowired
    private final NotificationService notificationService;

    public UserController(AuthenticationService authenticationService, NotificationService notificationService) {
        this.authenticationService = authenticationService;
        this.notificationService = notificationService;
    }

//    @PostMapping("/savedUser")
//    public User createCustomer(@Valid @RequestBody User user) {
//        return userService.createUser(user);
//    }


    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile() {

        return ResponseEntity.ok(userService.getCurrentUser());

    }

//    @PutMapping("/profile")
//    public ResponseEntity<UserDto> updateProfile(
//            @Valid @RequestBody UpdateUserRequest request) {
//
//        UserDto updatedUser = userService.updateCurrentUser(request);
//
//        return ResponseEntity.ok(updatedUser);
//    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiSuccessResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);

        return ResponseEntity.ok(
                new ApiSuccessResponse("Password changed successfully")
        );
    }

    @Operation(
            summary = "Create User",
            description = "Creates a new user in the system"
    )
    @PostMapping("/savedUser")
    public ResponseEntity<User> createCustomer(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    //          HARD DELETE
    @DeleteMapping("/deleteUser/{id}")
    public void deleteById(@PathVariable int id) {
        userService.deleteById(id);
    }

    //restore controller
    @PutMapping("/restoreUser/{id}")
    public void restoreById(@PathVariable int id) {
        userService.restoreById(id);
    }


    @PutMapping("/updateUser/{userId}")
    public ResponseEntity<User> updateUserData(
            @PathVariable int userId,
            @RequestBody User updatedUser) {

        User user = userService.updateUserData(userId, updatedUser);
        System.out.println(user);
        return ResponseEntity.ok(user);
    }

@Operation(
        summary = "User Login",
        description = "Authenticate user using email and password"
)
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(
        @RequestBody LoginRequest request
) {

    try {

        return ResponseEntity.ok(
                authenticationService.login(request)
        );

    } catch (BadCredentialsException e) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                        new LoginResponse(
                                null,
                                "",
                                "",
                                "Invalid email or password"
                        )
                );
    }
}

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message","logged out successfully"));

    }

    @PostMapping("/profile-picture")
    public ResponseEntity<UserDto> uploadProfilePicture(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                userService.uploadProfilePicture(file)
        );
    }

    @DeleteMapping("/profile-picture")
    public ResponseEntity<UserDto> deleteProfilePicture() {

        UserDto userDto = userService.deleteProfilePicture();

        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(
                userService.updateProfile(request)
        );
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> getNotifications() {

        return ResponseEntity.ok(
                notificationService.getCurrentUserNotifications()
        );
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(
            @PathVariable int id) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllAsRead() {

        notificationService.markAllAsRead();

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable int id) {

        notificationService.deleteNotification(id);

        return ResponseEntity.noContent().build();
    }



}
