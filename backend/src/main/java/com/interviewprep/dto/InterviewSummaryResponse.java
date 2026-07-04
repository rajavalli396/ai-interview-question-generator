package com.interviewprep.dto;

import java.time.LocalDateTime;

public record InterviewSummaryResponse(
        Long id,
        String role,
        String experience,
        String difficulty,
        int numberOfQuestions,
        int score,
        LocalDateTime createdAt
) {
}
