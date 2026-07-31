package com.example.programming.exception;

public class InvalidCurrentPasswordException extends RuntimeException{

    public InvalidCurrentPasswordException(String message){

        super(message);
    }
}
