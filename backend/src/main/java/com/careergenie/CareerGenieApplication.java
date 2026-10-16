package com.careergenie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CareerGenieApplication {
    public static void main(String[] args) {
        SpringApplication.run(CareerGenieApplication.class, args);
    }
}
