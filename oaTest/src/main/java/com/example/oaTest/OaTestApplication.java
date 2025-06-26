package com.example.oaTest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.example.oaTest.Entity")
@EnableJpaRepositories(basePackages = "com.example.oaTest.Repository")
public class OaTestApplication {
	public static void main(String[] args) {
		SpringApplication.run(OaTestApplication.class, args);
	}
}
