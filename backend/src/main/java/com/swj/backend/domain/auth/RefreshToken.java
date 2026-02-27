package com.swj.backend.domain.auth;

import java.time.LocalDateTime;

import com.swj.backend.domain.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "refresh_token")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@Column(nullable = false, unique = true, length = 500)
	private String token;
	
	@Column(nullable = false)
	private LocalDateTime expiresAt;
	
	@Builder
	public RefreshToken(User user, String token, LocalDateTime expiresAt) {
		this.user = user;
		this.token = token;
		this.expiresAt = expiresAt;
	}
	
	/** 토큰 갱신 로직 */
	public void updateToken(String token, LocalDateTime expiresAt) {
		this.token = token;
		this.expiresAt = expiresAt;
	}
}
