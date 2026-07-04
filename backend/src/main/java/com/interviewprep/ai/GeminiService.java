package com.interviewprep.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.config.AppProperties;
import com.interviewprep.dto.AnswerDto;
import com.interviewprep.dto.GenerateQuestionsRequest;
import com.interviewprep.exception.ApiException;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Service
public class GeminiService {

    private final AppProperties properties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public GeminiService(AppProperties properties, ObjectMapper objectMapper, RestClient.Builder restClientBuilder) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.restClient = restClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public List<String> generateQuestions(GenerateQuestionsRequest request) {
        String prompt = """
                Generate %d interview questions for a %s.
                Candidate experience: %s.
                Difficulty: %s.
                Return only valid JSON in this exact shape:
                {"questions":["question one","question two"]}
                Do not include markdown, numbering outside strings, explanations, or extra fields.
                """.formatted(
                request.numberOfQuestions(),
                request.role(),
                request.experience(),
                request.difficulty()
        );

        QuestionsPayload payload = readJson(callGemini(prompt), QuestionsPayload.class);
        if (payload.questions() == null || payload.questions().isEmpty()) {
            throw new ApiException("Gemini did not return interview questions.", HttpStatus.BAD_GATEWAY);
        }
        return payload.questions().stream().limit(request.numberOfQuestions()).toList();
    }

    public EvaluationPayload evaluateAnswers(String role, String experience, String difficulty, List<AnswerDto> answers) {
        String answersJson = writeJson(answers);
        String prompt = """
                Evaluate this technical interview for role: %s.
                Candidate experience: %s.
                Difficulty: %s.
                Answers JSON: %s
                Return only valid JSON in this exact shape:
                {
                  "score": 0,
                  "strengths": ["specific strength"],
                  "weaknesses": ["specific weakness"],
                  "suggestions": ["specific suggestion"]
                }
                Score must be an integer from 0 to 100. Give concise, practical feedback.
                """.formatted(role, experience, difficulty, answersJson);

        EvaluationPayload payload = readJson(callGemini(prompt), EvaluationPayload.class);
        int score = Math.max(0, Math.min(100, payload.score()));
        return new EvaluationPayload(
                score,
                defaultList(payload.strengths(), "Shows areas of readiness based on submitted answers."),
                defaultList(payload.weaknesses(), "Needs more complete and specific technical explanations."),
                defaultList(payload.suggestions(), "Practice with structured answers and concrete project examples.")
        );
    }

    private String callGemini(String prompt) {
        if (!StringUtils.hasText(properties.gemini().apiKey())) {
            throw new ApiException("GEMINI_API_KEY is not configured.", HttpStatus.SERVICE_UNAVAILABLE);
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.4,
                        "responseMimeType", "application/json"
                )
        );

        GeminiResponse response = restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/{model}:generateContent")
                        .queryParam("key", properties.gemini().apiKey())
                        .build(properties.gemini().model()))
                .body(body)
                .retrieve()
                .body(GeminiResponse.class);

        String text = response != null
                && response.candidates() != null
                && !response.candidates().isEmpty()
                && response.candidates().getFirst().content() != null
                && response.candidates().getFirst().content().parts() != null
                && !response.candidates().getFirst().content().parts().isEmpty()
                ? response.candidates().getFirst().content().parts().getFirst().text()
                : null;

        if (!StringUtils.hasText(text)) {
            throw new ApiException("Gemini returned an empty response.", HttpStatus.BAD_GATEWAY);
        }
        return cleanJson(text);
    }

    private String cleanJson(String value) {
        return value.replace("```json", "")
                .replace("```", "")
                .trim();
    }

    private <T> T readJson(String json, Class<T> type) {
        try {
            return objectMapper.readValue(json, type);
        } catch (JsonProcessingException exception) {
            throw new ApiException("Unable to parse Gemini response.", HttpStatus.BAD_GATEWAY);
        }
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new ApiException("Unable to prepare interview answers.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<String> defaultList(List<String> values, String fallback) {
        return values == null || values.isEmpty() ? List.of(fallback) : values;
    }

    private record QuestionsPayload(List<String> questions) {
    }

    public record EvaluationPayload(int score, List<String> strengths, List<String> weaknesses, List<String> suggestions) {
    }

    private record GeminiResponse(List<Candidate> candidates) {
    }

    private record Candidate(Content content) {
    }

    private record Content(List<Part> parts) {
    }

    private record Part(String text) {
    }
}
