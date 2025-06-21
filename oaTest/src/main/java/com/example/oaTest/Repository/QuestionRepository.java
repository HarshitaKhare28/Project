package com.example.oaTest.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oaTest.Entity.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    
}
