package com.swj.backend.domain.display.promotion;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodayPromotionsService {

	private final TodayPromotionsRepository todayPromotionsRepository;
	
	@Transactional
	public List<TodayPromotions> getActivePromotions() {
		LocalDateTime now = LocalDateTime.now();
		
		return todayPromotionsRepository.findActivePromotionsAtCurrentTime(now);
	}
}
