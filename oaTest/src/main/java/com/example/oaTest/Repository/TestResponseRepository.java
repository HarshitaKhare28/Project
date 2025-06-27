
package com.example.oaTest.Repository;

import com.example.oaTest.Entity.TestResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TestResponseRepository extends JpaRepository<TestResponse, Long> {
    @Query("SELECT tr FROM TestResponse tr WHERE tr.testId = :testId AND tr.user.userId = :userId")
    List<TestResponse> findByTestIdAndUserId(String testId, Long userId);
}
