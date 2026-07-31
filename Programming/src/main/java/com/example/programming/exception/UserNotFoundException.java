package com.example.programming.exception;

public class UserNotFoundException extends RuntimeException{

    public UserNotFoundException(String message){

        super(message);

    }

}