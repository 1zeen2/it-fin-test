package com.swj.backend.global.auth;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	private final JwtProvider jwtProvider;
	
	/** 
	 * 로그인, 회원가입은 토큰 검사를 하지 않음. 
	 * 	토큰 검사는 로그인 요청 이후 실행.
	 * 	로그인 요청시 토큰 검사를 하면 access, refresh 둘 다 영원히 못 받음
	 */
	@Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/") || 
 		       path.startsWith("/api/product/") || 
               path.startsWith("/api/v1/");
    }
	
	/** 클라이언트에서 요청을 보낼 때 마다 실행 */
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		
		// HTTP 헤더에서 JWT 토큰 추출
		String token = resolveToken(request);
		
		if (token != null && jwtProvider.validateToken(token)) {
			String loginId = jwtProvider.getLoginIdFromToken(token);
			
			// 권한 정보는 빈 리스트로 둠 (나중에 세밀하게 제어하기 위해)
			UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginId, null, Collections.emptyList());
			
			// 인증 정보 등록
			SecurityContextHolder.getContext().setAuthentication(authenticationToken);
			
		}
		filterChain.doFilter(request, response);
	}
	
	private String resolveToken(HttpServletRequest request) {
	    Cookie[] cookies = request.getCookies();
	    
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if ("accessToken".equals(cookie.getName())) {
	                return cookie.getValue();
	            }
	        }
	    }
	    return null;
	}
}
