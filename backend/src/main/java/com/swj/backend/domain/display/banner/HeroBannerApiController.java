package com.swj.backend.domain.display.banner;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/hero-banners")
@RequiredArgsConstructor
public class HeroBannerApiController {
	/** 
	 * 	단순 조회 기능이므로 Service를 생략하고
	 * 	Repository에서 바로 데이터를 꺼내서 전달.
	 * 	  => 서비스 계층이 무거운 편이기 때문.
	 */
	
	private final HeroBannerRepository heroBannerRepository;
	
	@GetMapping
	public ResponseEntity<List<HeroBanner>> getActiveBanners() {
		
		List<HeroBanner> banners = heroBannerRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc();
		
		return ResponseEntity.ok(banners);
	}
}
