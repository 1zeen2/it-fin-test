package com.swj.backend.global.auth;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	private final JwtProvider jwtProvider;
	
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
	
	// Http Header에서 'Bearer ' (공백 포함)로 시작하는 토큰만 잘라냄
	private String resolveToken(HttpServletRequest request) {
		
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        return null;
    }
}
