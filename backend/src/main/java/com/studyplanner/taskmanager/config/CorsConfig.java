package com.studyplanner.taskmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration.
 * Responsibility: Implements WebMvcConfigurer to configure allowed origins, HTTP methods, headers, and credentials.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    // TODO: Configure CORS mappings reading allowed origins from application properties (app.cors.allowed-origin)
}
