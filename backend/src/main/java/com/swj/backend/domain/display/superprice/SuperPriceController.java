package com.swj.backend.domain.display.superprice;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/display/super-prices")
@RequiredArgsConstructor
public class SuperPriceController {

	private final SuperPriceService superPriceService;
	
	/**
	 * 메인 화면
	 * 멤버십 슈퍼 특가 상품 8개 랜덤 조회 API
	 */
	@GetMapping
	public ResponseEntity<List<SuperPriceResponseDto>> getSuperPriceProducts() {
		List<SuperPriceResponseDto> response = superPriceService.getSuperPriceProducts();
		return ResponseEntity.ok(response);
	}
}
