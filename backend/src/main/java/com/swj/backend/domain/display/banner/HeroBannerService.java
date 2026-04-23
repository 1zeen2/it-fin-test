package com.swj.backend.domain.display.banner;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeroBannerService {

	private final HeroBannerRepository heroBannerRepository;
	
	@Transactional(readOnly = true)
	public List<HeroBannerResponseDto> getActiveBanners() {
		return heroBannerRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
			.stream()
			.map(HeroBannerResponseDto::from)
			.collect(Collectors.toList());
	}
}
