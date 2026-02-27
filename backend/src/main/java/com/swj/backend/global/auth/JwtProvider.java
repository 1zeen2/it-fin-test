package com.swj.backend.global.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;


@Component
public class JwtProvider {
	
	@Value("${jwt.secret}")
    private String salt;

    @Value("${jwt.expiration-time}")
    private long expirationTime;

    private SecretKey secretKey;
	
	@PostConstruct
    protected void init() {
        this.secretKey = Keys.hmacShaKeyFor(salt.getBytes(StandardCharsets.UTF_8));
    }
	
	/** 유저 아이디(loginId) 기반으로 JWT 생성 */
	public String createToken(String loginId) {
		Date now = new Date();
		Date validity = new Date(now.getTime() + expirationTime);
		
		return Jwts.builder()
				   .subject(loginId)
				   .issuedAt(now)
				   .expiration(validity)
				   .signWith(secretKey)
				   .compact();
	}
}
