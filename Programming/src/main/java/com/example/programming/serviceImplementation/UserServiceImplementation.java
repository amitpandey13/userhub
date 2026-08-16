package com.example.programming.serviceImplementation;

import com.example.programming.Repositories.RoleRepository;
import com.example.programming.Repositories.UserRepo;
import com.example.programming.dto.ChangePasswordRequest;
import com.example.programming.dto.UpdateProfileRequest;
import com.example.programming.dto.UpdateUserRequest;
import com.example.programming.dto.UserDto;
import com.example.programming.entities.Role;
import com.example.programming.entities.User;
import com.example.programming.enums.AuditAction;
import com.example.programming.enums.RoleName;
import com.example.programming.enums.UserStatus;
import com.example.programming.exception.*;
import com.example.programming.services.AuditLogService;
import com.example.programming.services.FileStorageService;
import com.example.programming.services.UserService;
import com.example.programming.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    public UserRepo userRepo;

    @Autowired
    public RoleRepository roleRepository;

    private final FileStorageService fileStorageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private final SecurityUtil securityUtil;
    @Autowired
    private final AuditLogService auditLogService;

    private static final Logger logger =
            LoggerFactory.getLogger(UserServiceImplementation.class);

    public UserServiceImplementation(FileStorageService fileStorageService, SecurityUtil securityUtil, AuditLogService auditLogService) {
        this.fileStorageService = fileStorageService;
        this.securityUtil = securityUtil;
        this.auditLogService = auditLogService;
    }
    // mapping user to userdto

    private UserDto mapToDto(User user) {

        UserDto dto = new UserDto();

        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        if (user.getRole() != null) {
            dto.setRole(user.getRole().getName().name());
        }

        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        dto.setProfilePicture(
                fileStorageService.getProfilePictureUrl(
                        user.getProfilePicture()
                )
        );

        return dto;
    }
    public User createUser(User user) {

        logger.info("Creating user with email: {}", user.getEmail());

        if (userRepo.findByEmail(user.getEmail()).isPresent()) {

            logger.warn("Duplicate email registration attempt: {}", user.getEmail());

            throw new DuplicateEmailException("Email already exists");
        }

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> {

                    logger.error("Default ROLE_USER not found in database.");

                    return new DefaultRoleNotFoundException("Default role not found");

                });

        String encodedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);
        user.setRole(userRole);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepo.save(user);



        logger.info("User created successfully. Id: {}, Email: {}",
                savedUser.getUserId(),
                savedUser.getEmail());

        return savedUser;
    }

    //user created by admin
    public User createUserByAdmin(User user) {

        logger.info("Creating user with email: {}", user.getEmail());

        if (userRepo.findByEmail(user.getEmail()).isPresent()) {

            logger.warn("Duplicate email registration attempt: {}", user.getEmail());

            throw new DuplicateEmailException("Email already exists");
        }

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> {

                    logger.error("Default ROLE_USER not found in database.");

                    return new DefaultRoleNotFoundException("Default role not found");

                });

        String encodedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);
        user.setRole(userRole);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepo.save(user);



        logger.info("User created successfully. Id: {}, Email: {}",
                savedUser.getUserId(),
                savedUser.getEmail());
//        audit log implementation

        auditLogService.log(

                securityUtil.getCurrentUser(),      // Who performed the action (Admin)

                savedUser,                          // Which user was affected

                AuditAction.USER_CREATED,           // Action type

                "Created user : " + savedUser.getName(),

                null                               // IP Address (we'll add later)

        );
        return savedUser;
    }

    @Override
    public Page<User> getAllUsers(int page, int size, UserStatus status) {
        Pageable pageable = PageRequest.of(page, size);

        if (status == null) {
            return userRepo.findAll(pageable);
        }

        return userRepo.findByStatus(status, pageable);
//        return userRepo.findAll(pageable);
    }

    //SOFT DELETE
public void deleteById(int id) {

    User user = userRepo.findById(id)
            .orElseThrow(() ->
                    new UserNotFoundException(
                            "User not found"
                    ));

    user.setStatus(UserStatus.INACTIVE);

    userRepo.save(user);

    auditLogService.log(

            securityUtil.getCurrentUser(),

            user,

            AuditAction.USER_DELETED,

            "Deleted user: " + user.getName(),

            null

    );
}

    public void restoreById(int id) {
        logger.info("id {}",id);
        User user = userRepo.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        ));

        user.setStatus(UserStatus.ACTIVE);

        userRepo.save(user);
        auditLogService.log(

                securityUtil.getCurrentUser(),

                user,

                AuditAction.USER_STATUS_CHANGED,

                "Changed status to " + user.getStatus(),

                null

        );
    }

    public User updateUserData(int userId, User updatedUser) {

        logger.info("Updating user with id {}", userId);
        User existingUser = userRepo.findById(userId)
                .orElseThrow( () -> {
                    logger.error("User not found : {}",userId);
                    return new UserNotFoundException(
                            "User not found"
                    );
                });

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        logger.info("user ,{}{}",updatedUser.getName(),updatedUser.getUserId());

        // Update password only if the frontend sends a new password.
        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(updatedUser.getPassword())
            );
        }

        logger.info("User is updated: {}",userId);

        System.out.println(existingUser.getUserId());
       System.out.println("Current User: " + securityUtil.getCurrentUser().getEmail());
        auditLogService.log(

                securityUtil.getCurrentUser(),

                existingUser,

                AuditAction.USER_UPDATED,

                "user updated " + existingUser.getUserId(),

                null

        );
        return userRepo.save(existingUser);


    }


    public User login(User user) {

        logger.info("Login attempt for {}", user.getEmail());

        User userN = userRepo.findByEmail(user.getEmail())
                .orElseThrow(() -> {

                    logger.warn("Login failed. Email not found: {}", user.getEmail());

                    return new InvalidCredentialsException(
                            "Invalid email or password"
                    );

                });

        if (!passwordEncoder.matches(user.getPassword(), userN.getPassword())) {

            logger.warn("Invalid password for {}", user.getEmail());

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );

        }

        logger.info("User logged in successfully: {}", user.getEmail());
        auditLogService.log(

                securityUtil.getCurrentUser(),

                user,

                AuditAction.LOGIN,

                "user updated " + user.getUserId(),

                null

        );

        return userN;
    }
    public List<User> searchUsers(String keyword) {

        return userRepo
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        keyword,
                        keyword

                );
    }

    @Override
    public boolean emailExists(String email) {

        System.out.println("Checking email: " + email);

        return userRepo.findByEmail(email).isPresent();

    }

    @Override
    public void updatePassword(String email, String password) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        ));

        user.setPassword(passwordEncoder.encode(password));

        userRepo.save(user);
    }

    private User getLoggedInUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));
    }
    @Override
    public UserDto getCurrentUser() {

    User user = getLoggedInUser();

        return UserDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .city(user.getCity())
                .country(user.getCountry())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .bio(user.getBio())
                .profilePicture(
                        user.getProfilePicture() != null
                                ? fileStorageService.getProfilePictureUrl(user.getProfilePicture())
                                : null
                )
                .role(user.getRole().getName().name())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }


    @Override
    public UserDto updateCurrentUser(UpdateUserRequest request) {

       User user = getLoggedInUser();

        user.setName(request.getName());

        User updatedUser = userRepo.save(user);

        return UserDto.builder()
                .userId(updatedUser.getUserId())
                .name(updatedUser.getName())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole().getName().name())
                .status(updatedUser.getStatus())
                .createdAt(updatedUser.getCreatedAt())
                .updatedAt(updatedUser.getUpdatedAt())
                .build();
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        // Verify current password

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new InvalidCurrentPasswordException(
                    "Current password is incorrect"
            );
        }

        // Check new password and confirm password

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new PasswordMismatchException(
                    "New Password and Confirm Password do not match"
            );
        }

        // Prevent same password

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new SamePasswordException(
                    "New password cannot be the same as current password"
            );
        }

        // Encode and save

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepo.save(user);
        auditLogService.log(

                securityUtil.getCurrentUser(),

                securityUtil.getCurrentUser(),

                AuditAction.PASSWORD_CHANGED,

                "Changed password.",

                null

        );

        logger.info("Password changed successfully for user : {}", email);

    }

    @Override
    public UserDto uploadProfilePicture(MultipartFile file) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        if (user.getProfilePicture() != null &&
                !user.getProfilePicture().isBlank()) {

            fileStorageService.deleteProfilePicture(
                    user.getProfilePicture()
            );
        }

        String fileName =
                fileStorageService.saveProfilePicture(file);

        user.setProfilePicture(fileName);

        userRepo.save(user);
        auditLogService.log(

                securityUtil.getCurrentUser(),

                securityUtil.getCurrentUser(),

                AuditAction.PROFILE_PICTURE_UPDATED,

                "Uploaded profile picture.",

                null

        );

        return UserDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .city(user.getCity())
                .country(user.getCountry())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .bio(user.getBio())
                .profilePicture(
                        user.getProfilePicture() != null
                                ? fileStorageService.getProfilePictureUrl(user.getProfilePicture())
                                : null
                )
                .role(user.getRole().getName().name())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

    }

    @Override
    public UserDto deleteProfilePicture() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        if (user.getProfilePicture() != null &&
                !user.getProfilePicture().isBlank()) {

            fileStorageService.deleteProfilePicture(
                    user.getProfilePicture()
            );

            user.setProfilePicture(null);

            userRepo.save(user);
            auditLogService.log(

                    securityUtil.getCurrentUser(),

                    securityUtil.getCurrentUser(),

                    AuditAction.PROFILE_PICTURE_DELETED,

                    "Deleted profile picture.",

                    null

            );
        }

        UserDto dto = new UserDto();

        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAddress(user.getAddress());
        dto.setBio(user.getBio());
        dto.setCity(user.getCity());
        dto.setCountry(user.getCountry());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole().getName().name());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setProfilePicture(null);

        return dto;
    }

    @Override
    public UserDto updateProfile(UpdateProfileRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        user.setBio(request.getBio());

        userRepo.save(user);
        auditLogService.log(

                securityUtil.getCurrentUser(),

                securityUtil.getCurrentUser(),

                AuditAction.PROFILE_UPDATED,

                "Updated own profile.",

                null

        );

        return UserDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .city(user.getCity())
                .country(user.getCountry())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .bio(user.getBio())
                .role(user.getRole().getName().name())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .profilePicture(
                        user.getProfilePicture() != null
                                ? fileStorageService.getProfilePictureUrl(
                                user.getProfilePicture())
                                : null
                )
                .build();
    }



}
