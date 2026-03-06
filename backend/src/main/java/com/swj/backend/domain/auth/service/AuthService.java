package com.swj.backend.domain.auth.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swj.backend.domain.auth.domain.RefreshToken;
import com.swj.backend.domain.auth.repository.RefreshTokenRepository;
import com.swj.backend.domain.user.User;
import com.swj.backend.global.auth.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {
	
	private final JwtProvider jwtProvider;
	private final RefreshTokenRepository refreshTokenRepository;
	
	
	@Transactional
	public Map<String, String> generateAndSaveToken(User user) {
		String newAccessToken = jwtProvider.createAccessToken(user.getLoginId());
		String newRefreshToken = jwtProvider.createRefreshToken(user.getLoginId());
		
		LocalDateTime expiresAt = LocalDateTime.now().plus(jwtProvider.getRefreshExpirationTime(), ChronoUnit.MILLIS);
		
		// 기존 토큰이 있으면 업데이트, 없으면 새로 생성 후 저장
		RefreshToken savedToken = refreshTokenRepository.findByUserId(user.getId())
                .orElse(RefreshToken.builder()
                        .user(user)
                        .token(newRefreshToken)
                        .expiresAt(expiresAt)
                        .build());
		
		savedToken.updateToken(newRefreshToken, expiresAt);
		refreshTokenRepository.save(savedToken);
		
		Map<String, String> tokens = new HashMap<>();
		tokens.put("accessToken", newAccessToken);
		tokens.put("refreshToken", newRefreshToken);
		
		return tokens;
	}
	
	@Transactional
	public Map<String, String> reissue(String requestRefreshToken) {
		
		// 넘어온 리프레시 토큰의 유효성 검증
		if (!jwtProvider.validateToken(requestRefreshToken)) {
			throw new IllegalArgumentException("유효하지 않거나, 만료된 토큰 입니다.");
		}
		
		RefreshToken savedToken = refreshTokenRepository.findByToken(requestRefreshToken)
				.orElseThrow(() -> new IllegalArgumentException("DB에 존재하지 않는 토큰입니다."));
		
		return generateAndSaveToken(savedToken.getUser());
	}

}
