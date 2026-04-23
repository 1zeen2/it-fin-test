package com.swj.backend.domain.display.banner;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/display/hero-banners")
@RequiredArgsConstructor
public class HeroBannerController {
	
	private final HeroBannerService heroBannerService;
	
	@GetMapping
	public ResponseEntity<List<HeroBannerResponseDto>> getActiveBanners() {
		
		List<HeroBannerResponseDto> banners = heroBannerService.getActiveBanners();
		
		return ResponseEntity.ok(banners);
	}
	
}
