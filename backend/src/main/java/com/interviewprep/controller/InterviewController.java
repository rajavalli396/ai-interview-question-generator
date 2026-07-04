package com.interviewprep.controller;

import com.interviewprep.dto.EvaluateInterviewRequest;
import com.interviewprep.dto.GenerateQuestionsRequest;
import com.interviewprep.dto.GenerateQuestionsResponse;
import com.interviewprep.dto.InterviewResultResponse;
import com.interviewprep.entity.User;
import com.interviewprep.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/generate")
    public GenerateQuestionsResponse generate(@Valid @RequestBody GenerateQuestionsRequest request) {
        return interviewService.generateQuestions(request);
    }

    @PostMapping("/evaluate")
    public InterviewResultResponse evaluate(@Valid @RequestBody EvaluateInterviewRequest request, @AuthenticationPrincipal User user) {
        return interviewService.evaluateAndSave(request, user);
    }
}
