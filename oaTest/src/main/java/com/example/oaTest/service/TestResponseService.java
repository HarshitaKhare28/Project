package com.example.oaTest.service;

import com.example.oaTest.Entity.TestResponse;
import com.example.oaTest.Repository.TestResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestResponseService {
    @Autowired
    private TestResponseRepository testResponseRepository;

    public TestResponse saveResponse(TestResponse response) {
        return testResponseRepository.save(response);
    }
}