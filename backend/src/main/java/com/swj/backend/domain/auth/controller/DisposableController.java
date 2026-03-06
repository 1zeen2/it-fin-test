package com.swj.backend.domain.auth.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swj.backend.domain.auth.service.DisposableService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth/disposable")
@RequiredArgsConstructor
public class DisposableController {

	private final DisposableService disposableService;
	
	// 모바일 기기용 일회용 번호 생성(로그인 된 상태여야 함)
	@PostMapping
    public ResponseEntity<?> generateDisposableNumber() {
        String loginId = SecurityContextHolder.getContext().getAuthentication().getName();
        String authNumber = disposableService.generateDisposableNumber(loginId);
        
        return ResponseEntity.ok(Map.of("authNumber", authNumber));
    }
	
	// PC 브라우저용 일회용 번호 검증 및 로그인 처리 (토큰 없이 접근 가능해야 함)
	@PostMapping("/verify")
	public ResponseEntity<?> verifyDisposableNumber(@RequestParam("authNumber") String authNumber) {
		
		try {
            Map<String, String> tokens = disposableService.verifyAndLogin(authNumber);
            
            return ResponseEntity.ok(tokens);
            
        } catch (IllegalArgumentException e) {
        	
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
		
	}
}
