package com.swj.backend.domain.auth.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.swj.backend.domain.auth.service.QrService;

@RestController
@RequestMapping("/api/auth/qr")
public class QrController {
	
	private final QrService qrService;
	
	public QrController(QrService qrService) {
		this.qrService = qrService;
	}

	// QR 생성 요청
	@PostMapping
	public ResponseEntity<?> generateQr() {
		QrService.QrSession session = qrService.generateQrSession();
		
		// 클라이언트에 세션 id, 인증 번호 응답
		return ResponseEntity.ok(Map.of(
					"sessionId", session.getSessionId(),
					"authNumber", session.getAuthNumber()
				));
	}
	
	// SSE 연결 (대기)
	@GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@RequestParam("sessionId") String sessionId) {
        return qrService.subscribe(sessionId);
    }
	
	@PostMapping("/verify")
	public ResponseEntity<?> verifyQr(@RequestParam("sessionId") String sessionId, @RequestParam("authNumber") String authNumber) {
		String loginId = SecurityContextHolder.getContext().getAuthentication().getName();
		
		boolean isSuccess = qrService.verifyAndLogin(sessionId, authNumber, loginId);
		
		if (isSuccess) {
			return ResponseEntity.ok(Map.of("message", "QR 인증이 완료되었습니다."));
		} else {
			return ResponseEntity.badRequest().body(Map.of("message", "번호가 일치하지 않거나, 세션이 만료되었습니다."));
		}
	}
	
}
