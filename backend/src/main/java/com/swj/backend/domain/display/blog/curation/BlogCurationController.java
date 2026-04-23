package com.swj.backend.domain.display.blog.curation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/display/blog-curations")
@RequiredArgsConstructor
public class BlogCurationController {
	
	private final BlogCurationService blogCurationService;

	/** 블로그 큐레이션 목록 조회 */
	@GetMapping
	public ResponseEntity<List<BlogCurationResponseDto>> getActiveCurations() {
		log.info("GET /api/blogs/curations 목록 조회 요청 수신");
		
		List<BlogCurationResponseDto> response = blogCurationService.getActiveCurations();
		
		return ResponseEntity.ok(response);
	}
}
