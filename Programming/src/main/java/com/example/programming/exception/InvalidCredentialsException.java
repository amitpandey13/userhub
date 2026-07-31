package com.example.programming.exception;

public class InvalidCredentialsException extends RuntimeException{

    public InvalidCredentialsException(String message){

        super(message);

    }

}