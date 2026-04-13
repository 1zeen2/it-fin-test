package com.swj.backend.domain.keyword;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/trending-keywords")
@RequiredArgsConstructor
public class TrendingKeywordController {
	
	private final TrendingKeywordService trendingKeywordService;
	
	/* 어제 기준 Top 10 조회 */
	@GetMapping
	public ResponseEntity<List<TrendingKeyword>> getTrendingKeywords() {
		List<TrendingKeyword> keywords = trendingKeywordService.getYesterdayTrendingKeywords();
		
		return ResponseEntity.ok(keywords);
	}
	
	@PostMapping("/search")
	public ResponseEntity<Void> recordSearch(@RequestBody Map<String, String> request) {
		String keyword = request.get("keyword");
		
		trendingKeywordService.recordSearchKeyword(keyword);
		
		return ResponseEntity.ok().build();
	}

}
