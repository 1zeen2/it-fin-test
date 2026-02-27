package com.swj.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.swj.backend.global.auth.JwtAuthenticationFilter;
import com.swj.backend.global.auth.JwtProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtProvider jwtProvider;

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // REST API는 상태를 저장하지 않아 CSRF 공격으로부터 상대적으로 안전하긴 함
            
            // JWT 사용으로 인한 기본 로그인 폼 및 HTTP Basic 인증 비활성화
            .formLogin(AbstractHttpConfigurer:: disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            
            // 세션 관리 설정: STATELESS (JWT는 서버가 유저의 상태를 기억하지 않는 것이 핵심이기 떄문)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/signUp", "/api/users/signIn").permitAll() // 회원 가입, 로그인은 모두 허용
                .anyRequest().authenticated()) // 그 외 모든 요청은 token 필요
            
            /** 스프링의 기본 인증 필터(UsernamePasswordAuthenticationFilter)가 작동하기 전에
             * 	JWT 필터가 먼저 토큰을 검사하도록 맨 앞에 작성.
             */
            .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}