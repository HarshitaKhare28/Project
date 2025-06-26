package com.example.oaTest.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "test_responses")
@Data
public class TestResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "response_id")
    private Long responseId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "selected_option", nullable = false)
    private String selectedOption;

    @Column(name = "test_id")
    private String testId;
}