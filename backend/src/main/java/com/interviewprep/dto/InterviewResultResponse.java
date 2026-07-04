package com.interviewprep.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewResultResponse(
        Long id,
        String role,
        String experience,
        String difficulty,
        int numberOfQuestions,
        int score,
        List<String> strengths,
        List<String> weaknesses,
        List<String> suggestions,
        List<AnswerDto> answers,
        LocalDateTime createdAt
) {
}
