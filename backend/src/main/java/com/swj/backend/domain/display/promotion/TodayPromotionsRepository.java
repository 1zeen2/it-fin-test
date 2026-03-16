package com.swj.backend.domain.display.promotion;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TodayPromotionsRepository extends JpaRepository<TodayPromotions, Long>{
	
	@Query("""
			
			SELECT tp FROM TodayPromotions tp
			WHERE tp.isActive = true
			AND :now BETWEEN tp.startAt AND tp.endAt
			ORDER BY tp.displayOrder ASC
			
			""")
	List<TodayPromotions> findActivePromotionsAtCurrentTime(@Param("now") LocalDateTime now);
	
}
