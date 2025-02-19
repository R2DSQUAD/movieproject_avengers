package org.spring.moviepj.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class WebSecurityConfigurationClass {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider();
    }

    @Bean
    public CustomLoginSuccessHandler customLoginSuccessHandler() {
        // JwtTokenProvider를 주입해서 CustomLoginSuccessHandler를 생성
        return new CustomLoginSuccessHandler(jwtTokenProvider());
    }

        private final UserDetailsService userDetailsService;

    public WebSecurityConfigurationClass(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }


    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable();

       
        http.authorizeHttpRequests()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/api/**").permitAll()
                .requestMatchers("/member/login").permitAll()
                
                .anyRequest().authenticated();
        http.cors().configurationSource(request -> {
            CorsConfiguration corsConfig = new CorsConfiguration();
            corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
            corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
            corsConfig.setAllowCredentials(true);
            return corsConfig;
        });
        
        http.formLogin()
                .loginPage("/member/login")
                .usernameParameter("userEmail")
                .passwordParameter("userPw")
                .loginProcessingUrl("/member/login")
                .successHandler(customLoginSuccessHandler());  

        return http.build();
    }
}
