package com.example.programming.exception;

public class EmptyFileException extends RuntimeException{
    public EmptyFileException(String message)
    {
        super(message);
    }
}
