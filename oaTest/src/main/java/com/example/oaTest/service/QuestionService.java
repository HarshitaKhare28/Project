package com.example.oaTest.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.oaTest.Entity.Question;
import com.example.oaTest.Repository.QuestionRepository;
import com.example.oaTest.Repository.SubjectRepository;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    /**
     * Fetch all questions from database
     */
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    /**
     * Calculate weighted score for a user based on their answers
     */
    public double calculateWeightedScore(List<Question> answeredQuestions, List<String> userAnswers) {
        double weightedScore = 0.0;
        double totalTestMarks = answeredQuestions.size() * 10.0;  // Example: total test marks

        // Count number of questions per subject
        Map<Long, Long> subjectQuestionCounts = answeredQuestions.stream()
            .filter(q -> q.getSubject() != null)
            .collect(Collectors.groupingBy(
                q -> q.getSubject().getSubjectId(),
                Collectors.counting()
            ));

        for (int i = 0; i < answeredQuestions.size(); i++) {
            Question question = answeredQuestions.get(i);
            String correctOption = question.getCorrectOption();
            String userAnswer = userAnswers.get(i);

            double subjectWeightage = question.getSubject() != null && question.getSubject().getWeightage() != null
                    ? question.getSubject().getWeightage()
                    : 0.0;

            long numQuestionsInSubject = subjectQuestionCounts.getOrDefault(
                    question.getSubject().getSubjectId(), 1L);

            // Calculate marks per question based on subject weightage
            double marksPerQuestion = (subjectWeightage * totalTestMarks) / numQuestionsInSubject;

            if (correctOption != null && correctOption.equals(userAnswer)) {
                weightedScore += marksPerQuestion;
            }
        }
        return weightedScore;
    }

    /**
     * Save a new question
     */
    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    /**
     * Delete a question by ID
     */
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    /**
     * Update an existing question
     */
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
    public void computeMarksForQuestions(List<Question> questions) {
        if (questions == null || questions.isEmpty()) return;
        Map<Long, List<Question>> questionsBySubject = questions.stream()
            .filter(q -> q.getSubject() != null)
            .collect(Collectors.groupingBy(q -> q.getSubject().getSubjectId()));

        for (Map.Entry<Long, List<Question>> entry : questionsBySubject.entrySet()) {
            List<Question> subjectQuestions = entry.getValue();
            if (subjectQuestions.isEmpty()) continue;

            Double weightage = subjectQuestions.get(0).getSubject().getWeightage();
            if (weightage == null) weightage = 0.0;
            double marksPerQuestion = weightage / subjectQuestions.size();
            for (Question q : subjectQuestions) {
                q.setMarks(marksPerQuestion);
            }
        }
    }
}
