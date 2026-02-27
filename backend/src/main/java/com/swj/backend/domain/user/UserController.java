package com.swj.backend.domain.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swj.backend.domain.user.dto.UserSignInDto;
import com.swj.backend.domain.user.dto.UserSignUpDto;

import lombok.RequiredArgsConstructor;
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
	 * 	로그인 테스트 API ( JWT 추가 이후 수정해야 함)
	 */
	@PostMapping("/signIn")
	public ResponseEntity<?> signIn(@RequestBody UserSignInDto signInDto) {
		try {
			String token = userService.signIn(signInDto);
			
			// 프론트엔드에서 파싱하기 쉽도록 백엔드에서 JSON으로 감싸써 반환
			// 추후 TokenResponseDto로 분리 예정 (access, refresh)
			Map<String, String> response = new HashMap<>();
			response.put("accessToken", token);
			response.put("message" , "로그인 성공");
			
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
	
}
