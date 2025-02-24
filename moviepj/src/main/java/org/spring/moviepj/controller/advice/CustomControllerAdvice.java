package org.spring.moviepj.controller.advice;

import java.util.Map;

import org.spring.moviepj.util.CustomJWTException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class CustomControllerAdvice {
    
    @ExceptionHandler(CustomJWTException.class)
    protected ResponseEntity<?> handleJWTException(CustomJWTException e){
        String msg=e.getMessage();

        return ResponseEntity.ok().body(Map.of("error",msg));
    }
}
