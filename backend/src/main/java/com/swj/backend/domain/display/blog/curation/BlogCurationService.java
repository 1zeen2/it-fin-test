package com.swj.backend.domain.display.blog.curation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BlogCurationService {
	
	private final BlogCurationRepository blogCurationRepository;
	
	public List<BlogCurationResponseDto> getActiveCurations() {
		List<BlogCuration> activeCurations = blogCurationRepository.findByIsActiveTrue();
		
		return activeCurations.stream()
				.map(BlogCurationResponseDto::from)
				.collect(Collectors.toList());
	}

}
