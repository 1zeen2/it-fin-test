package com.swj.backend.global.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Component
public class JwtProvider {
	
	/** application.yml에서 시크릿 키 추출 */
	@Value("${jwt.secret}")
    private String salt;

	/** application.yml에서 만료 기간 추출 */
    @Value("${jwt.expiration-time}")
    private long expirationTime;
    
    @Value("${jwt.refresh-expiration-time}")
    private long refreshExpirationTime;

    private SecretKey secretKey;
	
	@PostConstruct
    protected void init() {
        this.secretKey = Keys.hmacShaKeyFor(salt.getBytes(StandardCharsets.UTF_8));
    }
	
	/** Access Token 생성 */
	public String createAccessToken(String loginId) {
        return buildToken(loginId, expirationTime);
    }
	
	/** Refresh Token 생성 */
	public String createRefreshToken(String loginId) {
		return buildToken(loginId, expirationTime);
	}
	
	/** 토큰에서 유저 아이디 추출 */
	public String getLoginIdFromToken(String token) {
		Claims claims = Jwts.parser()
				.verifyWith(secretKey)
				.build()
				.parseSignedClaims(token)
				.getPayload();
		
		return claims.getSubject();
	}
	
	/** 토큰 생성 공통 로직 */
	private String buildToken(String loginId, long expiration) {
		Date now = new Date();
		Date validity = new Date(now.getTime() + expiration);
		
		return Jwts.builder()
				   .subject(loginId)
				   .issuedAt(now)
				   .expiration(validity)
				   .signWith(secretKey)
				   .compact();
	}
	
	/** 토큰 유효성 검사 */
	public boolean validateToken(String token) {
		try {
			Jwts.parser()
				.verifyWith(secretKey)
				.build()
				.parseSignedClaims(token);
			return true;
			
		} catch (JwtException | IllegalArgumentException e) {
			// 토큰이 만료되었거나, 형식에 안맞으면 예외 처리
			log.error("유효하지 않은 토큰입니다.: {}" , e.getMessage());
			return false;
			
		}
	}
	
	
	
}
