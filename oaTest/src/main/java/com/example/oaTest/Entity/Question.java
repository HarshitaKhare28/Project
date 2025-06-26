package com.example.oaTest.Entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "questions")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "questionId")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @Column(nullable = false, columnDefinition = "CLOB")
    private String questionText;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    private String correctOption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SUBJECT_ID", nullable = false)
    private Subject subject;

    @Transient
    private List<String> options;

    @PostLoad
    public void fillOptionsFromFields() {
        this.options = List.of(optionA, optionB, optionC, optionD);
    }

    @PrePersist
    @PreUpdate
    public void fillFieldsFromOptions() {
        if (options != null && options.size() == 4) {
            this.optionA = options.get(0);
            this.optionB = options.get(1);
            this.optionC = options.get(2);
            this.optionD = options.get(3);
        }
    }

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestResponse> responses;

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }
    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }
    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }
    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }
    public String getCorrectOption() { return correctOption; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public List<TestResponse> getResponses() { return responses; }
    public void setResponses(List<TestResponse> responses) { this.responses = responses; }
}