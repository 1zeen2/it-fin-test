package com.swj.backend.domain.auth.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swj.backend.domain.auth.service.AuthService;
import com.swj.backend.domain.user.User;
import com.swj.backend.domain.user.UserService;
import com.swj.backend.domain.user.dto.UserLoginDto;
import com.swj.backend.domain.user.dto.UserSignupDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserService userService;
	private final AuthService authService;
	
	/**
	 *	회원 가입 API
	 *	POST /api/auth/signup 
	 */
	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> signup(@RequestBody UserSignupDto signUpDto) {
		// DTO -> Entity 변환
		User user = signUpDto.toEntity();
		
		// Service 호출 및 DB 저장
		Long saveUserId = userService.signUp(user);
		
		// Axios 파싱이 용이하도록 JSON 형태로 응답        
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(Map.of("message", "회원 가입 성공", "userId", saveUserId));
    }
	
	/**
	 * 	로그인 API
	 * 	POST /api/auth/login
	 */
	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginDto loginDto) {
        try {
            Map<String, String> tokens = userService.login(loginDto);
            tokens.put("message", "로그인 성공");
            
            return ResponseEntity.ok(tokens);
            
        } catch (IllegalArgumentException e) {
            // 아이디 없음, 비밀번호 불일치 등의 예외 발생 시 401 상태 코드와 메시지 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            		.body(Map.of("message", e.getMessage()));
        }
    }
	
	/**
	 *	토큰 재발급 API
	 * 	POST /api/auth/reissue	
	 */
	@PostMapping("/reissue")
	public ResponseEntity<Map<String, String>> reissue(@RequestBody Map<String, String> request) {
		try {
			String requestRefreshToken = request.get("refreshToken");
			
			if (requestRefreshToken == null || requestRefreshToken.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "리프레시 토큰이 누락되었습니다."));
            }
			
			Map<String, String> tokens = authService.reissue(requestRefreshToken);
			
			tokens.put("message", "토큰 재발급 성공");
			
			return ResponseEntity.ok(tokens);
			
		} catch (IllegalArgumentException e){
			
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
		}
		
	}
}
