
package com.example.oaTest.Controller;

import java.util.Collections;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.oaTest.Entity.TestResponse;
import com.example.oaTest.service.TestResponseService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/test")
public class TestResponseController {
    private static final Logger LOGGER = Logger.getLogger(TestResponseController.class.getName());

    @Autowired
    private TestResponseService testResponseService;

    @PostMapping("/response")
    public ResponseEntity<?> saveResponse(@RequestBody TestResponse response, HttpServletRequest request) {
        LOGGER.info("Received POST request to /api/test/response from " + request.getRemoteAddr() +
                    " with payload: " + response + ", Headers: " + Collections.list(request.getHeaderNames()));
        try {
            TestResponse savedResponse = testResponseService.saveResponse(response);
            LOGGER.info("Successfully saved response: " + savedResponse);
            return ResponseEntity.ok(savedResponse);
        } catch (IllegalArgumentException e) {
            LOGGER.severe("Validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            LOGGER.severe("Unexpected error saving response: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }

    @GetMapping("/response/test")
    public ResponseEntity<String> testEndpoint(HttpServletRequest request) {
        LOGGER.info("Received GET request to /api/test/response/test from " + request.getRemoteAddr() +
                    ", Headers: " + Collections.list(request.getHeaderNames()));
        return ResponseEntity.ok("Test endpoint accessible");
    }
}
