package com.example.oaTest.Controller;

import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.oaTest.service.TestResponseService;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "http://localhost:5173")
public class ScoreController {
    private static final Logger LOGGER = Logger.getLogger(ScoreController.class.getName());

    @Autowired
    private TestResponseService testResponseService;

    @GetMapping("/{userId}/{testId}")
    public ResponseEntity<?> getWeightedScore(@PathVariable Long userId, @PathVariable String testId) {
        try {
            double score = testResponseService.calculateWeightedScore(userId, testId, 100.0); 
            LOGGER.info("Calculated score for userId: " + userId + ", testId: " + testId + ": " + score);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            LOGGER.severe("Error calculating score: " + e.getMessage());
            return ResponseEntity.status(500).body("Error calculating score: " + e.getMessage());
        }
    }
}