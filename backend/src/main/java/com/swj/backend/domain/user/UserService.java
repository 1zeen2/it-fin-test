package com.swj.backend.domain.user;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swj.backend.domain.auth.RefreshToken;
import com.swj.backend.domain.auth.RefreshTokenRepository;
import com.swj.backend.domain.user.dto.UserSignInDto;
import com.swj.backend.global.auth.JwtProvider;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;
	private final RefreshTokenRepository refreshTokenRepository;
	
	/** 회원 가입 로직 */
	@Transactional
	public Long signUp(User user) {
		validateDuplicateUser(user);
		
		String encodedPassword = passwordEncoder.encode(user.getPwd());
		user.encodePassword(encodedPassword);
		
		return userRepository.save(user).getId();
	}
	
	/** 중복 회원 검증 로직 */
	private void validateDuplicateUser(User user) {
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new IllegalStateException("이미 존재하는 이메일 입니다.");
		}
		
		if (user.getLoginId() != null && userRepository.existsByLoginId(user.getLoginId())) {
			throw new IllegalStateException("이미 존재하는 아이디 입니다.");
		}
	}
	
	/** 로그인 아이디, 비밀번호 일치 검사 로직 */
	@Transactional
	public Map<String, String> signIn(UserSignInDto signInDto) {
		
		User user = userRepository.findByLoginId(signInDto.getLoginId())
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디 입니다."));
		
		if (!passwordEncoder.matches(signInDto.getPwd(), user.getPwd())) {
			throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
		}
		
		String accessToken = jwtProvider.createAccessToken(user.getLoginId());
		String refreshToken = jwtProvider.createRefreshToken(user.getLoginId());
		
		LocalDateTime expiresAt = LocalDateTime.now().plus(jwtProvider.getRefreshExpirationTime(), ChronoUnit.MILLIS);
		
		RefreshToken savedToken = refreshTokenRepository.findByUserId(user.getId())
				.map(token-> {
					token.updateToken(refreshToken, expiresAt);
					return token;
				})
				.orElse(RefreshToken.builder()
						.user(user)
						.token(refreshToken)
						.expiresAt(expiresAt)
						.build());
		
		refreshTokenRepository.save(savedToken);
		
		Map<String, String> tokenMap = new HashMap<>();
		tokenMap.put("accessToken", accessToken);
		tokenMap.put("refreshToken", refreshToken);
		
		return tokenMap;
	}
	
	
}
