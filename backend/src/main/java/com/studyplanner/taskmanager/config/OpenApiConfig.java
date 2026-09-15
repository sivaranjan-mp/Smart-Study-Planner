package com.studyplanner.taskmanager.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger Documentation Configuration.
 * Responsibility: Configures springdoc-openapi OpenAPI bean (title, version, description, contact) for Swagger UI.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI taskManagerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Study Planner & Task Management API")
                        .version("1.0.0")
                        .description("REST API documentation for Smart Study Planner & Task Management System.")
                        .contact(new Contact()
                                .name("Smart Study Planner Development Team")
                                .email("support@studyplanner.com")));
    }
}
