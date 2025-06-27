
package com.example.oaTest.service;

import com.example.oaTest.Entity.TestResponse;
import com.example.oaTest.Entity.Question;
import com.example.oaTest.Repository.TestResponseRepository;
import com.example.oaTest.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.logging.Logger;

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
}
