package org.spring.moviepj.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfigClass implements WebMvcConfigurer {

    private static final String DEVELOP_FRONT_ADDRESS = "http://43.201.20.172:3000";
    String saveFiles = "file:///E:/saveFiles/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/upload/**")
                .addResourceLocations(saveFiles);// upload
        WebMvcConfigurer.super.addResourceHandlers(registry);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        DEVELOP_FRONT_ADDRESS,

                        "https://api.iamport.kr")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .maxAge(300)
                .exposedHeaders("location")
                .allowedHeaders("Authorization", "Cache-Control", "Content-Type")
                .allowCredentials(true);
    }
}
