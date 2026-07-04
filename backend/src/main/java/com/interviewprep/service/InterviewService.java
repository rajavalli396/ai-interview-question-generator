package com.interviewprep.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.ai.GeminiService;
import com.interviewprep.dto.AnswerDto;
import com.interviewprep.dto.EvaluateInterviewRequest;
import com.interviewprep.dto.GenerateQuestionsRequest;
import com.interviewprep.dto.GenerateQuestionsResponse;
import com.interviewprep.dto.InterviewResultResponse;
import com.interviewprep.dto.InterviewSummaryResponse;
import com.interviewprep.entity.InterviewHistory;
import com.interviewprep.entity.User;
import com.interviewprep.exception.ApiException;
import com.interviewprep.repository.InterviewHistoryRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InterviewService {

    private final GeminiService geminiService;
    private final InterviewHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;

    public InterviewService(GeminiService geminiService, InterviewHistoryRepository historyRepository, ObjectMapper objectMapper) {
        this.geminiService = geminiService;
        this.historyRepository = historyRepository;
        this.objectMapper = objectMapper;
    }

    public GenerateQuestionsResponse generateQuestions(GenerateQuestionsRequest request) {
        return new GenerateQuestionsResponse(geminiService.generateQuestions(request));
    }

    @Transactional
    public InterviewResultResponse evaluateAndSave(EvaluateInterviewRequest request, User user) {
        GeminiService.EvaluationPayload evaluation = geminiService.evaluateAnswers(
                request.role(),
                request.experience(),
                request.difficulty(),
                request.answers()
        );

        InterviewHistory history = new InterviewHistory();
        history.setUser(user);
        history.setRole(request.role());
        history.setExperience(request.experience());
        history.setDifficulty(request.difficulty());
        history.setNumberOfQuestions(request.numberOfQuestions());
        history.setScore(evaluation.score());
        history.setAnswersJson(writeJson(request.answers()));
        history.setStrengthsJson(writeJson(evaluation.strengths()));
        history.setWeaknessesJson(writeJson(evaluation.weaknesses()));
        history.setSuggestionsJson(writeJson(evaluation.suggestions()));

        return toResult(historyRepository.save(history));
    }

    @Transactional(readOnly = true)
    public List<InterviewSummaryResponse> listHistory(User user) {
        return historyRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public InterviewResultResponse getHistory(Long id, User user) {
        return toResult(findHistory(id, user));
    }

    @Transactional
    public void deleteHistory(Long id, User user) {
        historyRepository.delete(findHistory(id, user));
    }

    private InterviewHistory findHistory(Long id, User user) {
        return historyRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException("Interview result not found.", HttpStatus.NOT_FOUND));
    }

    private InterviewSummaryResponse toSummary(InterviewHistory history) {
        return new InterviewSummaryResponse(
                history.getId(),
                history.getRole(),
                history.getExperience(),
                history.getDifficulty(),
                history.getNumberOfQuestions(),
                history.getScore(),
                history.getCreatedAt()
        );
    }

    private InterviewResultResponse toResult(InterviewHistory history) {
        return new InterviewResultResponse(
                history.getId(),
                history.getRole(),
                history.getExperience(),
                history.getDifficulty(),
                history.getNumberOfQuestions(),
                history.getScore(),
                readStringList(history.getStrengthsJson()),
                readStringList(history.getWeaknessesJson()),
                readStringList(history.getSuggestionsJson()),
                readAnswerList(history.getAnswersJson()),
                history.getCreatedAt()
        );
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new ApiException("Unable to save interview result.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<AnswerDto> readAnswerList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (JsonProcessingException exception) {
            return List.of();
        }
    }

    private List<String> readStringList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (JsonProcessingException exception) {
            return List.of();
        }
    }
}
