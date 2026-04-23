package com.swj.backend.domain.display.quickmenu;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/display/quick-menus")
@RequiredArgsConstructor
public class QuickMenuController {

	private final QuickMenuService quickMenuService;
	
	@GetMapping
	public ResponseEntity<List<QuickMenuResponseDto>> getQuickMenus() {
		List<QuickMenuResponseDto> quickMenus = quickMenuService.getActiveQuickMenus();
		return ResponseEntity.ok(quickMenus);
	}
}