package com.interviewprep.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Cors cors, Jwt jwt, Gemini gemini) {

    public record Cors(String allowedOrigin) {
    }

    public record Jwt(String secret, long expirationMs) {
    }

    public record Gemini(String apiKey, String model) {
    }
}
