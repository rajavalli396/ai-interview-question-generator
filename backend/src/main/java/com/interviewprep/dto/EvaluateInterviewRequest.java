package com.interviewprep.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record EvaluateInterviewRequest(
        @NotBlank String role,
        @NotBlank String experience,
        @NotBlank String difficulty,
        @Min(1) @Max(10) int numberOfQuestions,
        @NotEmpty List<@Valid AnswerDto> answers
) {
}
