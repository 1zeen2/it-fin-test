package com.swj.backend.domain.user;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	
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
}
