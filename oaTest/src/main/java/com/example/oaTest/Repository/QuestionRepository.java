package com.example.oaTest.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.oaTest.Entity.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.subject")
    List<Question> findAllWithSubjects();

    List<Question> findBySubject_SubjectId(Long subjectId);
}