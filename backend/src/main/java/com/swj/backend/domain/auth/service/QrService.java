package com.swj.backend.domain.auth.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.swj.backend.domain.user.User;
import com.swj.backend.domain.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QrService {

	private final Map<String, QrSession> sessionStore = new ConcurrentHashMap<>();
	
	// 토큰 발급 및 저장 컴포넌트
	private final AuthService authService;
	private final UserRepository userRepository;
	
	public QrSession generateQrSession() {
		String sessionId = UUID.randomUUID().toString();
		String authNumber = String.valueOf(ThreadLocalRandom.current().nextInt(10, 100)); 
		
		QrSession session = new QrSession(sessionId, authNumber);
		sessionStore.put(sessionId, session);
		
		return session;
	}
	
	// 클라이언트와 SSE 연결
	public SseEmitter subscribe(String sessionId) {
		QrSession session = sessionStore.get(sessionId);
		
		if (session == null || session.isExpired()) {
			throw new IllegalArgumentException("유효하지 않거나 만료된 세션입니다.");
		}
		
		// 180초 타미어 설정
		SseEmitter emitter = new SseEmitter(180 * 1000L);
		session.setEmitter(emitter);
		
		emitter.onCompletion(() -> sessionStore.remove(sessionId));
		emitter.onTimeout(() -> {
			sessionStore.remove(sessionId);
			emitter.complete();
		});
		
		try {
			emitter.send(SseEmitter.event().name("connected").data("SSE Connected"));
		} catch (IOException e) {
			emitter.completeWithError(e);
		}
		
		return emitter;
	}
	
	// 모바일에서 숫자 입력 시 검증 및 PC로 성공 알림 전송
	@Transactional	
	public boolean verifyAndLogin(String sessionId, String authNumber, String loginId) {
		QrSession session = sessionStore.get(sessionId);
		
		if (session != null && !session.isExpired() && session.getAuthNumber().equals(authNumber)) {
			SseEmitter emitter = session.getEmitter();
			
			if (emitter != null) {
				try {
					User user = userRepository.findByLoginId(loginId)
											  .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 입니다."));
					
					Map<String, String> tokens = authService.generateAndSaveToken(user);
					
					String successPayload = String.format("{\"accessToken\":\"%s\", \"refreshToken\":\"%s\"}", 
							tokens.get("accessToken"), tokens.get("refreshToken"));
					
					emitter.send(SseEmitter.event().name("auth-success").data(successPayload));
					emitter.complete();
					sessionStore.remove(sessionId);
					
					return true;
					
				} catch (IOException e) {
					emitter.completeWithError(e);
				}
			}
		}
		
		return false;
	}
	
	// 내부 데이터 클래스 (DTO 역할)
	public static class QrSession {
		private final String sessionId;
		private final String authNumber;
		private final LocalDateTime expireAt;
		private SseEmitter emitter;
		
		public QrSession(String sessionId, String authNumber) {
			this.sessionId = sessionId;
			this.authNumber = authNumber;
			this.expireAt = LocalDateTime.now().plusMinutes(3); // 유효 시간 3분
		}
		
		public boolean isExpired() {
			
			return LocalDateTime.now().isAfter(expireAt);
		}
		
		public String getSessionId() { return sessionId; }
		public String getAuthNumber() { return authNumber; }
		public SseEmitter getEmitter() { return emitter; }
		public void setEmitter(SseEmitter emitter) { this.emitter = emitter; }
	}
	
	
}
