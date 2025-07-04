package com.example.oaTest.Controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.oaTest.Entity.Question;
import com.example.oaTest.Repository.QuestionRepository;
import com.example.oaTest.service.QuestionService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {
    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionService questionService;

    @PersistenceContext
    private EntityManager entityManager;

    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody Question question) {
        try {
            System.out.println("Received question payload: " + question);
            if (question.getSubject() == null || question.getSubject().getSubjectId() == null) {
                System.out.println("Subject or Subject ID is null, rejecting request");
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Subject is required"));
            }
            Question savedQuestion = questionRepository.save(question);
            // entityManager.refresh(savedQuestion);
            System.out.println("Saved question with subject: " + savedQuestion.getSubject());
            return ResponseEntity.ok(savedQuestion);
        } catch (Exception e) {
            System.out.println("Error in createQuestion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to create question"));
        }
    }

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        try {
            List<Question> questions = questionRepository.findAllWithSubjects();
            questionService.computeMarksForQuestions(questions);

            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        try {
            Question existingQuestion = questionRepository.findById(id).orElse(null);
            if (existingQuestion == null) {
                return ResponseEntity.notFound().build();
            }

            if (question.getSubject() == null || question.getSubject().getSubjectId() == null) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("error", "Subject is required"));
            }

            System.out.println("Received PUT request for question ID: " + id + " with payload: " + question);

            existingQuestion.setQuestionText(question.getQuestionText());
            existingQuestion.setOptionA(question.getOptionA());
            existingQuestion.setOptionB(question.getOptionB());
            existingQuestion.setOptionC(question.getOptionC());
            existingQuestion.setOptionD(question.getOptionD());
            existingQuestion.setCorrectOption(question.getCorrectOption());
            existingQuestion.setOptions(question.getOptions());
            existingQuestion.setSubject(question.getSubject());

            questionRepository.save(existingQuestion);

            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        try {
            if (questionRepository.existsById(id)) {
                questionRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
