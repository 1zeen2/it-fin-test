package com.swj.backend.domain.product.keyword;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrendingKeywordService {

	private final TrendingKeywordRepository trendingKeywordRepository;
	
	/* 어제 날짜 기준으로 조회 */
	@Transactional
	public List<TrendingKeyword> getYesterdayTrendingKeywords() {
		
		/** 
		 *	데이터 편하게 보기 위해 우선 오늘 날짜로 수정 
		 */
		
//		LocalDate yesterday = LocalDate.now().minusDays(1);
		LocalDate today = LocalDate.now();
		
//		return trendingKeywordRepository.fintTop10TrendingKeywords(yesterday);
		return trendingKeywordRepository.fintTop10TrendingKeywords(today);
	}
	
	@Transactional
	public void recordSearchKeyword(String rawKeyword) {
		if (rawKeyword == null || rawKeyword.trim().isEmpty()) {
			return;
		}
		
		String keyword = rawKeyword.trim();
		
		String normalizedKeyword = keyword.replaceAll("\\s+", "");
		LocalDate today = LocalDate.now();
		
		/*
		 * 임시 이미지, 링크
		 * 추후 해당 검색어에 대한 상품이 있는지 체크 후
		 * 가장 첫 번째로 출력되는 상품의 이미지를 defaultImageUrl로 지정할 예정
		 * (검색 결과가 없는 카테고리 혹은 상품의 search_count를 저장하고, 
		 *  랭킹에 반영하는 오류? 쓰레기 데이터? 가 생기면 안되기 때문)
		 * 우선은 더미 데이터로 추가하는 방식.
		 */
		String defaultImageUrl = "https://via.placeholder.com/200?text=" + normalizedKeyword;
		String defaultLinkUrl = "/search?query=" + normalizedKeyword;
		
		trendingKeywordRepository.upsertSearchKeyword(
			keyword, normalizedKeyword, defaultImageUrl, defaultLinkUrl, today
		);
	}
}
