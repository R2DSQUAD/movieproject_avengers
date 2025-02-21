package org.spring.moviepj.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebOnlySecurityConfigClass {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(Customizer.withDefaults());
        http.csrf(cs -> cs.disable());

        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/", "/index").permitAll()
                .requestMatchers("/member/join", "/member/login").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/api/boxOfficeList", "/api/trailerList", "/api/screening/**").permitAll()
                .requestMatchers("/member/logout").authenticated()
                .anyRequest().authenticated());

        http.formLogin(login -> login
                .loginPage("/member/login").permitAll()
                .usernameParameter("userEmail")
                .passwordParameter("userPw")
                .loginProcessingUrl("/member/login")
                .failureUrl("/member/login?error=true")
                .defaultSuccessUrl("/", true).permitAll());

        http.logout(out -> out
                .logoutRequestMatcher(new AntPathRequestMatcher("/member/logout"))
                .logoutSuccessUrl("/"));

        return http.build();
    }
}
