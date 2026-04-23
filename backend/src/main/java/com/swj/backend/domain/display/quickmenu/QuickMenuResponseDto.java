package com.swj.backend.domain.display.quickmenu;

public record QuickMenuResponseDto(
	    Long id,
	    String name,
	    String imageUrl,
	    String linkUrl
) {
	public static QuickMenuResponseDto from(QuickMenu quickMenu) {
        return new QuickMenuResponseDto(
            quickMenu.getId(),
            quickMenu.getName(),
            quickMenu.getImageUrl(),
            quickMenu.getLinkUrl()
        );
    }
}
