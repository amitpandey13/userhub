package com.example.programming.serviceImplementation;

import com.example.programming.exception.EmptyFileException;
import com.example.programming.exception.FileStorageException;
import com.example.programming.exception.InvalidFileTypeException;
import com.example.programming.services.FileStorageService;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final Path uploadPath = Paths.get("uploads/profile");

    //constructor
    public FileStorageServiceImpl() {

        try {

            Files.createDirectories(uploadPath);

            log.info("Profile upload directory created at : {}", uploadPath.toAbsolutePath());

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create upload directory",
                    e
            );
        }

    }

    @Override
    public String saveProfilePicture(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new EmptyFileException("Please select an image.");
        }

        String originalFileName = file.getOriginalFilename();

        String extension = "";

        if (originalFileName != null &&
                originalFileName.contains(".")) {

            extension = originalFileName.substring(
                    originalFileName.lastIndexOf(".")
            );
        }

        extension = extension.toLowerCase();

        if (!extension.equals(".jpg")
                && !extension.equals(".jpeg")
                && !extension.equals(".png")) {

            throw new InvalidFileTypeException(
                    "Only JPG, JPEG and PNG images are allowed."
            );
        }

        String fileName =
                UUID.randomUUID() + extension;

        try {

            Files.copy(
                    file.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );

            log.info("Profile picture uploaded successfully : {}", fileName);

            return fileName;

        } catch (IOException e) {

            log.error("Error while uploading image.", e);

            throw new FileStorageException(
                    "Could not upload image."
            );
        }

    }

    @Override
    public void deleteProfilePicture(String fileName) {

        try {

            Files.deleteIfExists(
                    uploadPath.resolve(fileName)
            );

            log.info("Deleted profile picture : {}", fileName);

        } catch (IOException e) {

            log.error(
                    "Could not delete profile picture : {}",
                    fileName,
                    e
            );
        }

    }

    @Override
    public String getProfilePictureUrl(String fileName) {

        if (fileName == null || fileName.isBlank()) {
            return null;
        }

        return "/uploads/profile/" + fileName;
    }




}