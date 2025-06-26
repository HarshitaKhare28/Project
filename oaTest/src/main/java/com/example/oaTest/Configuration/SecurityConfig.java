package com.example.oaTest.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import java.util.logging.Logger;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private static final Logger LOGGER = Logger.getLogger(SecurityConfig.class.getName());

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        LOGGER.info("Configuring security filter chain");
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/questions/**", "/api/subjects/**", "/api/test/response").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}