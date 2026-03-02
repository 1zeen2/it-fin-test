package com.swj.backend.domain.auth;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	public Map<String, String> reissue(String requestRefreshToken) {
		
		// 넘어온 리프레시 토큰의 유효성 검증
		if (!jwtProvider.validateToken(requestRefreshToken)) {
			throw new IllegalArgumentException("유효하지 않거나, 만료된 토큰 입니다.");
		}
		
		// DB에 토큰이 존재하는지 확인
		RefreshToken savedToken = refreshTokenRepository.findByToken(requestRefreshToken)
				.orElseThrow(() -> new IllegalArgumentException("DB에 존재하지 않는 토큰입니다."));
		
		// 토큰을 통해 유저의 정보 가져오기
		User user = savedToken.getUser();
		
		// 새로운 AccessToken과 RefreshToken 발급
		String newAccessToken = jwtProvider.createAccessToken(user.getLoginId());
		String newRefreshToken = jwtProvider.createRefreshToken(user.getLoginId());
		
		// DB에 refreshToken 정보 업데이트
		LocalDateTime expiresAt = LocalDateTime.now().plus(jwtProvider.getRefreshExpirationTime(), ChronoUnit.MILLIS);
		savedToken.updateToken(newRefreshToken, expiresAt);
		
		// 프런트가 로그인 API와 동일하게 처리할 수 있도록 키값을 맞춰줌
		Map<String, String> tokens = new HashMap<>();
		tokens.put("accessToken", newAccessToken);
		tokens.put("refreshToken", newRefreshToken);
		
		return tokens;
	}

}
