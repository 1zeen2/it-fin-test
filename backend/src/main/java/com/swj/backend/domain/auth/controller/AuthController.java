package com.swj.backend.domain.auth.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
import com.swj.backend.global.auth.JwtProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserService userService;
	private final AuthService authService;
	private final JwtProvider jwtProvider; // 쿠키 유효시간 설정에 필요
	
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
            
            // Access Token 쿠키 생성
            ResponseCookie accessCookie = ResponseCookie.from("accessToken", tokens.get("accessToken"))
                    .httpOnly(true)
                    .secure(false) // 로컬 환경이므로 false. 나중에 https 적용 시 true로 변경해야 함
                    .path("/")
                    .maxAge(jwtProvider.getExpirationTime() / 1000) // JWT는 ms단위, Cookie(HTTP Standard)는 s단위를 사용함
                    .build();

            // Refresh Token 쿠키 생성
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokens.get("refreshToken"))
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(jwtProvider.getRefreshExpirationTime() / 1000)
                    .build();
            
            return ResponseEntity.ok()
            		.header(HttpHeaders.SET_COOKIE, accessCookie.toString())
            		.header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            		.body(Map.of("message", "로그인 성공"));
            
        } catch (IllegalArgumentException e) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        			.body(Map.of("message", e.getMessage()));
            
        }
    }
	
	/**
	 *	토큰 재발급 API
	 * 	POST /api/auth/reissue	
	 */
	@PostMapping("/reissue")
	public ResponseEntity<Map<String, String>> reissue(HttpServletRequest request) {
		try {
			String requestRefreshToken = null;
			
			Cookie[] cookies = request.getCookies();
			
			if (cookies != null) {
				for (Cookie cookie: cookies) {
					if ("refreshToken".equals(cookie.getName())) {
						requestRefreshToken = cookie.getValue();
						break;
					}
				}
			}
			
			if (requestRefreshToken == null || requestRefreshToken.isBlank()) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "리프레시 토큰이 누락되었음."));
			}
			
			// 서비스 단에서 토큰 재발급
			Map<String, String> tokens = authService.reissue(requestRefreshToken);
			
			ResponseCookie accessCookie = ResponseCookie.from("accessToken", tokens.get("accessToken"))
					.httpOnly(true)
					.secure(false)
					.path("/")
					.maxAge(jwtProvider.getExpirationTime() / 1000)
					.build();
			
			ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokens.get("refreshToken"))
					.httpOnly(true)
					.secure(false)
					.path("/")
					.maxAge(jwtProvider.getRefreshExpirationTime() / 1000)
					.build();
			
			return ResponseEntity.ok()
					.header(HttpHeaders.SET_COOKIE, accessCookie.toString())
					.header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
					.body(Map.of("message", "토큰 재발급 성공"));
			
		} catch (IllegalArgumentException e){
			
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
		}
		
	}
	
	@PostMapping("/logout")
	public ResponseEntity<Map<String, String>> logout() {
		ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
				.httpOnly(true)
				.secure(false)
				.path("/")
				.maxAge(0)
				.build();
		
		ResponseCookie refreshToken = ResponseCookie.from("refreshToken", "")
				.httpOnly(true)
				.secure(false)
				.path("/")
				.maxAge(0)
				.build();
		
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, accessCookie.toString())
				.header(HttpHeaders.SET_COOKIE, refreshToken.toString())
				.body(Map.of("message", "로그아웃 성공 및 쿠키 삭제 완료"));
	}
	
}
