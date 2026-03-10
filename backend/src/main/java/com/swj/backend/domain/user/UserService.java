package com.swj.backend.domain.user;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swj.backend.domain.auth.domain.RefreshToken;
import com.swj.backend.domain.auth.repository.RefreshTokenRepository;
import com.swj.backend.domain.user.dto.UserLoginDto;
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
		
		user.encodePassword(passwordEncoder.encode(user.getPwd()));
		
		return userRepository.save(user).getId();
	}
	
	/** 중복 회원 검증 로직 */
	private void validateDuplicateUser(User user) {
		if (user.getLoginId() == null || user.getLoginId().isBlank()) {
			// 입력 값이 오류이기 때문에 ArgumentException
			throw new IllegalArgumentException("아이디는 필수 입력 항목입니다.");
		}
		
		if (userRepository.existsByLoginId(user.getLoginId())) {
			// 입력값은 정상이나, DB에 이미 아이디가 존재하는 상태기 때문에 StateException
			throw new IllegalStateException("이미 사용 중인 아이디 입니다.");
		}
		
		// 입력한 이메일이 이미 DB에 저장된 이메일이 있는 경우 발생하는 예외기 때문에 StateException
		if (user.getEmail() != null && !user.getEmail().isBlank()) {
			if (userRepository.existsByEmail(user.getEmail())) {
				throw new IllegalStateException("이미 사용 중인 이메일 입니다.");
			}
		}
	}
	
	/** 로그인 아이디, 비밀번호 일치 검사 로직 */
	@Transactional
	public Map<String, String> signIn(UserLoginDto signInDto) {
		
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
