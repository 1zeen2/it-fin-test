package com.swj.backend.domain.display.banner;

import com.fasterxml.jackson.annotation.JsonRawValue;

public record HeroBannerResponseDto(
		Long id,
		String title,
		String linkUrl,
		String bgImageWebp,
		String titleImageWebp,
		String mainText,
		String subText,
		@JsonRawValue String productsJson
) {
	public static HeroBannerResponseDto from(HeroBanner heroBanner) {
		return new HeroBannerResponseDto(
			heroBanner.getId(),
			heroBanner.getTitle(),
			heroBanner.getLinkUrl(),
			heroBanner.getBgImageWebp(),
			heroBanner.getTitleImageWebp(),
			heroBanner.getMainText(),
			heroBanner.getSubText(),
			heroBanner.getProductsJson()
		);
				
	}
}
