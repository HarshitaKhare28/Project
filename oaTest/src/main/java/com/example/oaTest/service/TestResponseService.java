package com.example.oaTest.service;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.oaTest.Entity.Question;
import com.example.oaTest.Entity.Subject;
import com.example.oaTest.Entity.TestResponse;
import com.example.oaTest.Repository.QuestionRepository;
import com.example.oaTest.Repository.TestResponseRepository;

@Service
public class TestResponseService {
    private static final Logger LOGGER = Logger.getLogger(TestResponseService.class.getName());

    @Autowired
    private TestResponseRepository testResponseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public TestResponse saveResponse(TestResponse response) {
        LOGGER.info("Processing response: " + response);
        if (response.getQuestion() != null && response.getQuestion().getQuestionId() != null) {
            Question question = questionRepository.findById(response.getQuestion().getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found for ID: " + response.getQuestion().getQuestionId()));
            response.setCorrectOption(question.getCorrectOption());
        } else {
            throw new IllegalArgumentException("Question or question ID is missing");
        }
        TestResponse savedResponse = testResponseRepository.save(response);
        LOGGER.info("Saved response with correct_option: " + savedResponse.getCorrectOption());
        return savedResponse;
    }

    public double calculateWeightedScore(Long userId, String testId, double totalPossibleScore) {
        LOGGER.info("Calculating weighted score for userId: " + userId + ", testId: " + testId);
        List<TestResponse> responses = testResponseRepository.findByTestIdAndUserId(testId, userId);
        
        if (responses.isEmpty()) {
            LOGGER.warning("No responses found for userId: " + userId + ", testId: " + testId);
            return 0.0;
        }
        // Group responses by subject
        Map<Long, List<TestResponse>> responsesBySubject = responses.stream()
            .collect(Collectors.groupingBy(r -> r.getQuestion().getSubject().getSubjectId()));

        double totalScore = 0.0;

        for (Map.Entry<Long, List<TestResponse>> entry : responsesBySubject.entrySet()) {
            Long subjectId = entry.getKey();
            List<TestResponse> subjectResponses = entry.getValue();
            Subject subject = subjectResponses.get(0).getQuestion().getSubject();
            double weightage = subject.getWeightage(); 
            long correctCount = subjectResponses.stream()
                .filter(r -> r.getSelectedOption() != null && r.getSelectedOption().equals(r.getCorrectOption()))
                .count();
            
            double subjectScore = (correctCount / (double) subjectResponses.size()) * weightage * totalPossibleScore;
            totalScore += subjectScore;
        }

        LOGGER.info("Calculated weighted score: " + totalScore + " for userId: " + userId + ", testId: " + testId);
        return Math.round(totalScore);
    }
    public List<TestResponse> getResponsesByTestIdAndUserId(String testId, Long userId) {
        return testResponseRepository.findByTestIdAndUserId(testId, userId);
    }
}