package com.interviewprep.repository;

import com.interviewprep.entity.InterviewHistory;
import com.interviewprep.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewHistoryRepository extends JpaRepository<InterviewHistory, Long> {

    List<InterviewHistory> findByUserOrderByCreatedAtDesc(User user);

    Optional<InterviewHistory> findByIdAndUser(Long id, User user);
}
