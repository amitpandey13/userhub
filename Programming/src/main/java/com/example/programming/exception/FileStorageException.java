package com.example.programming.exception;

public class FileStorageException extends RuntimeException {
    public FileStorageException(String message)
    {
        super(message);
    }
}
