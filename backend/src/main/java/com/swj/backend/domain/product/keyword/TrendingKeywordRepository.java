package com.swj.backend.domain.product.keyword;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TrendingKeywordRepository extends JpaRepository<TrendingKeyword, Long>{

	/* 어제 날짜 기준 Top 10 조회 */
	@Query("""
		SELECT tk FROM TrendingKeyword tk
		WHERE tk.isActive = true
		AND tk.baseDate = :targetDate
		ORDER BY tk.searchCount DESC
		LIMIT 10
	""")
	List<TrendingKeyword> fintTop10TrendingKeywords(@Param("targetDate") LocalDate targetDate);
	
	/* 
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
}
