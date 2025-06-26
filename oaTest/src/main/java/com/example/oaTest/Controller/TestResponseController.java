package com.example.oaTest.Controller;

import com.example.oaTest.Entity.TestResponse;
import com.example.oaTest.service.TestResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/test")
public class TestResponseController {
    private static final Logger LOGGER = Logger.getLogger(TestResponseController.class.getName());

    @Autowired
    private TestResponseService testResponseService;

    @PostMapping("/response")
    public ResponseEntity<?> saveResponse(@RequestBody TestResponse response) {
        LOGGER.info("Received response: " + response);
        try {
            TestResponse savedResponse = testResponseService.saveResponse(response);
            LOGGER.info("Saved response: " + savedResponse);
            return ResponseEntity.ok(savedResponse);
        } catch (Exception e) {
            LOGGER.severe("Error saving response: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}