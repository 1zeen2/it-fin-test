package com.swj.backend.domain.display.quickmenu;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuickMenuService {
	
	private final QuickMenuRepository quickMenuRepository;
	
	@Transactional(readOnly = true)
	public List<QuickMenuResponseDto> getActiveQuickMenus() {
		return quickMenuRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
				.stream()
				.map(QuickMenuResponseDto::from)
				.collect(Collectors.toList());
	}
}
