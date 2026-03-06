package com.swj.backend.domain.auth.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swj.backend.domain.user.User;
import com.swj.backend.domain.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DisposableService {

	// Key: 8자리 일회용 비밀번호, Value: 세션 객체 (유저 ID 및 만료 시간)
	private final Map<String, DisposableSession> sessionStore = new ConcurrentHashMap<>();
	private final AuthService authService;
    private final UserRepository userRepository;
	
    // 모바일 앱에서 일회용 번호 발급 요청 시 호출
	public String generateDisposableNumber(String loginId) {
		String authNumber;
		
		// 중복되지 않는 8자리 숫자 생성 (천만 ~ 1억 - 1)
		do {
			authNumber = String.valueOf(ThreadLocalRandom.current().nextInt(10000000, 100000000));
		} while (sessionStore.containsKey(authNumber));
		
		sessionStore.put(authNumber, new DisposableSession(loginId));
		return authNumber;
	}
	
	@Transactional
	public Map<String, String> verifyAndLogin(String authNumber) {
		DisposableSession session = sessionStore.get(authNumber);
		
		if (session == null || session.isExpired()) {
			
			if (session != null) sessionStore.remove(authNumber); // 만료된 세션 삭제
			throw new IllegalArgumentException("유효하지 않거나 만료된 일회용 번호 입니다.");
		}
		
		// 검증 성공 시 즉시 일회용 번호 폐기
		sessionStore.remove(authNumber);
		
		User user = userRepository.findByLoginId(session.getLoginId())
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 입니다."));
		return authService.generateAndSaveToken(user);
	}
	
	// 내부 세션 관리 객체
	private static class DisposableSession {
		private final String loginId;
		private final LocalDateTime expireAt;
		
		public DisposableSession(String loginId) {
			this.loginId = loginId;
			this.expireAt = LocalDateTime.now().plusMinutes(3);
		}
		
		public String getLoginId() { return loginId; }
		
		public boolean isExpired() {
			return LocalDateTime.now().isAfter(expireAt);
		}
	}
}
