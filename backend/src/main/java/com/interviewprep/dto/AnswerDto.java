package com.interviewprep.dto;

import jakarta.validation.constraints.NotBlank;

public record AnswerDto(
        @NotBlank String question,
        String answer
) {
}
