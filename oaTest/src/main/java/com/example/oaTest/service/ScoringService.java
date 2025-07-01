package com.example.oaTest.service; // Use lowercase service

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.oaTest.Entity.Subject;
import com.example.oaTest.Entity.TestResponse;
import com.example.oaTest.service.TestResponseService;

@Service
public class ScoringService {

    @Autowired
    private TestResponseService testResponseService;

    public double calculateWeightedScore(Long userId, String testId, double totalPossibleScore) {
        List<TestResponse> responses = testResponseService.getResponsesByTestIdAndUserId(testId, userId);
        if (responses.isEmpty()) {
            return 0.0;
        }
    
        double totalWeightageOfCorrectAnswers = 0.0;
        double totalPossibleWeightage = 0.0;
    
        for (TestResponse response : responses) {
            double questionWeightage = response.getQuestion().getSubject().getWeightage();
            totalPossibleWeightage += questionWeightage;
    
            if (response.getSelectedOption() != null && response.getSelectedOption().equals(response.getCorrectOption())) {
                totalWeightageOfCorrectAnswers += questionWeightage;
            }
        }
    
        if (totalPossibleWeightage == 0) return 0.0;
    
        // Scale to totalPossibleScore
        double weightedScore = (totalWeightageOfCorrectAnswers / totalPossibleWeightage) * totalPossibleScore;
    
        return weightedScore;
    }
    
}