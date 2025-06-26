package com.example.oaTest.service;

import com.example.oaTest.Entity.Question;
import com.example.oaTest.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public Question updateQuestion(Long id, Question question) {
        if (questionRepository.existsById(id)) {
            Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id " + id));

            existingQuestion.setQuestionText(question.getQuestionText());
            existingQuestion.setOptionA(question.getOptionA());
            existingQuestion.setOptionB(question.getOptionB());
            existingQuestion.setOptionC(question.getOptionC());
            existingQuestion.setOptionD(question.getOptionD());
            existingQuestion.setCorrectOption(question.getCorrectOption());
            existingQuestion.setSubject(question.getSubject());

            return questionRepository.save(existingQuestion);
        } else {
            throw new RuntimeException("Question not found with id " + id);
        }
    }
}