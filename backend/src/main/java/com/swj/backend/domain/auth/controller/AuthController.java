package com.swj.backend.domain.auth.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swj.backend.domain.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;
	
	/**
	 *	토큰 재발급 API
	 * 	POST /api/auth/reissue	
	 */
	@PostMapping("/reissue")
	public ResponseEntity<?> reissue(@RequestBody Map<String, String> request) {
		try {
			String requestRefreshToken = request.get("refreshToken");
			
			if (requestRefreshToken == null || requestRefreshToken.isBlank()) {
				return ResponseEntity.badRequest().body("리프레시 토큰이 누락되었습니다.");
			}
			
			Map<String, String> tokens = authService.reissue(requestRefreshToken);
			
			tokens.put("message", "토큰 재발급 성공");
			
			return ResponseEntity.ok(tokens);
			
		} catch (IllegalArgumentException e){
			
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
		
	}
}
