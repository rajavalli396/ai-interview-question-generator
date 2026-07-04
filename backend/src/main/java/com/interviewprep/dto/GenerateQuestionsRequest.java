package com.interviewprep.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record GenerateQuestionsRequest(
        @NotBlank String role,
        @NotBlank String experience,
        @NotBlank String difficulty,
        @Min(1) @Max(10) int numberOfQuestions
) {
}
