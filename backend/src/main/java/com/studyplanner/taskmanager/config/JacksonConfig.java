package com.studyplanner.taskmanager.config;

import org.springframework.context.annotation.Configuration;

/**
 * Jackson JSON Serialization Configuration.
 * Responsibility: Registers JavaTimeModule and global ISO-8601 date/time serialization format for LocalDateTime fields.
 */
@Configuration
public class JacksonConfig {
    // TODO: Configure ObjectMapper / Jackson2ObjectMapperBuilderCustomizer for ISO-8601 formatting and JavaTimeModule
}
