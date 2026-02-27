package com.swj.backend.domain.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swj.backend.domain.user.dto.UserSignInDto;
import com.swj.backend.domain.user.dto.UserSignUpDto;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/users")
public class UserController {
	
	private final UserService userService;
	
	/**
	 *	회원 가입 API
	 *	POST
	 *	/api/users/signUp
	 */
	@PostMapping("/signUp")
	public ResponseEntity<String> signUpUser(@RequestBody UserSignUpDto signUpDto) {
		
		User user = signUpDto.toEntity();
		
		Long saveUserId = userService.signUp(user);
		
		return ResponseEntity.status(HttpStatus.CREATED)
				.body("회원 가입 성공. 생성된 유저 ID: " + saveUserId);
	}

	/**
	 * 	로그인 테스트 API (JWT 추가 이후 수정해야 함)
	 */
	@PostMapping("/signIn")
	public ResponseEntity<?> signIn(@RequestBody UserSignInDto signInDto) {
		try {
			Map<String, String> tokens = userService.signIn(signInDto);
			
			tokens.put("message", "로그인 성공");
			
			return ResponseEntity.ok(tokens);
			
		} catch (IllegalArgumentException e) {
			
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
	
	// API 경로도 부자연스럽게 느껴짐. ==> 수정 고려
	@GetMapping("/me")
	public ResponseEntity<?> getMyInfo(Authentication authentication) {
		
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자 입니다.");
		}
		
		// 필터에서 UsernamePasswordAuthenticationToken의 첫 번째 인자로 넣었던 loginId 추출
        String loginId = (String) authentication.getPrincipal();
		
        // 추후 UserService를 호출해서 DB에서 유저 상세 정보를 가져오는 로직으로 수정 예정.
		Map<String, String> response = new HashMap<>();
		response.put("loginId", loginId);
		response.put("message", "보안 검증 통과, " + loginId);
		
		return ResponseEntity.ok(response);
	}
	
}
