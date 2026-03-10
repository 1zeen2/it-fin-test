package com.swj.backend.domain.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/users")
public class UserController {
	
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
