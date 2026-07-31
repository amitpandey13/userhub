package com.example.programming.services;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String saveProfilePicture(MultipartFile file);

    void deleteProfilePicture(String fileName);

    String getProfilePictureUrl(String fileName);

}