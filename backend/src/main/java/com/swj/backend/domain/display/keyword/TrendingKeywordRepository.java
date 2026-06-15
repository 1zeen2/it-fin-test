package com.swj.backend.domain.display.keyword;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TrendingKeywordRepository extends JpaRepository<TrendingKeyword, Long>{
	
	/** 정규화된 키워드로(공백 제거한 단어) 엔티티 조회 */
	Optional<TrendingKeyword> findByNormalizedKeywordAndBaseDate(String normalizedKeyword, LocalDate baseDate);
	
	/** 검색어 오타 교정에 필요한 문자열 추출 */
	@Query("""
		SELECT tk.normalizedKeyword
		FROM TrendingKeyword tk
		WHERE tk.baseDate = :baseDate
		AND tk.isActive = true
	""")
	List<String> findAllNormalizedKeywordsByBaseDate(@Param("baseDate") LocalDate baseDate);
	
	/**
	 * UPSERT 로직
	 * 새로운 키워드면 INSERT, 기존 키워드면 UPDATE
	 */
	@Modifying
	@Query(value = """
	    INSERT INTO trending_keywords (keyword, normalized_keyword, image_url, link_url, search_count, base_date, is_active)
	    VALUES (:keyword, :normalizedKeyword, :imageUrl, :linkUrl, 1, :baseDate, 1)
	    ON DUPLICATE KEY UPDATE search_count = search_count + 1
	""", nativeQuery = true)
	void upsertSearchKeyword(
		@Param("keyword") String keyword,
		@Param("normalizedKeyword") String normalizedKeyword,
		@Param("imageUrl") String imageUrl,
		@Param("linkUrl") String linkUrl,
		@Param("baseDate") LocalDate baseDate
	);
	
	/** 어제 날짜 기준 Top 10 조회 */
	@Query("""
		SELECT tk FROM TrendingKeyword tk
		WHERE tk.isActive = true
		AND tk.baseDate = :baseDate
		ORDER BY tk.searchCount DESC
		LIMIT 10
	""")
	List<TrendingKeyword> findTop10TrendingKeywords(@Param("baseDate") LocalDate baseDate);
}
