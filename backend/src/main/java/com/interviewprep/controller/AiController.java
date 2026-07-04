package com.interviewprep.controller;

import com.interviewprep.dto.GenerateQuestionsRequest;
import com.interviewprep.dto.GenerateQuestionsResponse;
import com.interviewprep.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final InterviewService interviewService;

    public AiController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/generate")
    public GenerateQuestionsResponse generate(@Valid @RequestBody GenerateQuestionsRequest request) {
        return interviewService.generateQuestions(request);
    }
}
