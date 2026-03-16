package com.swj.backend.domain.display.promotion;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/today-promotions")
@RequiredArgsConstructor
public class TodayPromotionsController {

	private final TodayPromotionsService todayPromotionsService;
	
	@GetMapping
	public ResponseEntity<List<TodayPromotions>> getTodayPromotions() {
		List<TodayPromotions> todayPromotions = todayPromotionsService.getActivePromotions();
		
		return ResponseEntity.ok(todayPromotions);
	}
}
