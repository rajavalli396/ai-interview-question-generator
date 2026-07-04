package com.interviewprep.controller;

import com.interviewprep.dto.InterviewResultResponse;
import com.interviewprep.dto.InterviewSummaryResponse;
import com.interviewprep.entity.User;
import com.interviewprep.service.InterviewService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final InterviewService interviewService;

    public HistoryController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<InterviewSummaryResponse> list(@AuthenticationPrincipal User user) {
        return interviewService.listHistory(user);
    }

    @GetMapping("/{id}")
    public InterviewResultResponse get(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return interviewService.getHistory(id, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        interviewService.deleteHistory(id, user);
        return ResponseEntity.noContent().build();
    }
}
