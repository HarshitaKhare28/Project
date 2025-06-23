package com.example.oaTest.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oaTest.Entity.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
}
