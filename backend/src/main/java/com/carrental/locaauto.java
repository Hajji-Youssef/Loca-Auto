package com.carrental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class locaauto {
    public static void main(String[] args) {
        SpringApplication.run(locaauto.class, args);
    }
}
