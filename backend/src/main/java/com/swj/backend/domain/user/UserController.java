package com.swj.backend.domain.user;

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
	public ResponseEntity<String> signInTest(@RequestBody UserSignInDto signInDto) {
		try {
			Long userId = userService.signIn(signInDto);
			
			return ResponseEntity.ok("로그인 성공. 유저 ID: " + userId);
		} catch (IllegalArgumentException e) {
			
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
	
}
