package com.example.oaTest.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.oaTest.Entity.Subject;
import com.example.oaTest.Repository.SubjectRepository;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:5173")
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        try {
            return ResponseEntity.ok(subjectRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createSubject(@RequestBody Subject subject) {
        try {
            if (subject.getName() == null || subject.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Subject name is required");
            }
            if (subject.getWeightage() == null || subject.getWeightage() < 1 || subject.getWeightage() > 100) {
                return ResponseEntity.badRequest().body("Weightage must be between 1 and 100");
            }
            if (subject.getWeightage() % 1 != 0) {
                return ResponseEntity.badRequest().body("Weightage must be a whole number");
            }

            // Convert percentage to 0–1
            double weightage = subject.getWeightage() / 100.0;
            subject.setWeightage(weightage);

            List<Subject> existingSubjects = subjectRepository.findAll();
            double totalWeightage = existingSubjects.stream()
                    .mapToDouble(Subject::getWeightage)
                    .sum();
            totalWeightage += weightage;

            if (totalWeightage > 1.0) {
                return ResponseEntity.badRequest().body("Total weightage exceeds 100%");
            }

            return ResponseEntity.ok(subjectRepository.save(subject));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating subject: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody Subject subject) {
        try {
            Subject existingSubject = subjectRepository.findById(id).orElse(null);
            if (existingSubject == null) {
                return ResponseEntity.notFound().build();
            }
            if (subject.getName() != null && !subject.getName().trim().isEmpty()) {
                existingSubject.setName(subject.getName());
            }
            if (subject.getWeightage() != null) {
                if (subject.getWeightage() < 1 || subject.getWeightage() > 100) {
                    return ResponseEntity.badRequest().body("Weightage must be between 1 and 100");
                }
                if (subject.getWeightage() % 1 != 0) {
                    return ResponseEntity.badRequest().body("Weightage must be a whole number");
                }

                // Convert percentage to 0–1
                double weightage = subject.getWeightage() / 100.0;

                List<Subject> allSubjects = subjectRepository.findAll();
                double totalWeightage = allSubjects.stream()
                        .filter(s -> !s.getSubjectId().equals(id))
                        .mapToDouble(Subject::getWeightage)
                        .sum();
                totalWeightage += weightage;

                if (totalWeightage > 1.0) {
                    return ResponseEntity.badRequest().body("Total weightage exceeds 100%");
                }

                existingSubject.setWeightage(weightage);
            }
            return ResponseEntity.ok(subjectRepository.save(existingSubject));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating subject: " + e.getMessage());
        }
    }
}