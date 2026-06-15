package com.swj.backend.domain.display.superprice;

import com.swj.backend.domain.product.Product;

public record SuperPriceResponseDto(
		Long id,
		String title,
		Integer originalPrice,
		int price,
		Integer discountRate,
		int shippingFee,
		String displayTag,
		String imageUrl,
		String linkUrl
	) {
	public static SuperPriceResponseDto from(Product product, String displayTag) {
		Integer calculatedDiscount = null;
		
		if (product.getOriginalPrice() != null && product.getOriginalPrice() > product.getPrice()) {
			calculatedDiscount = (int) Math.round(
				(double) (product.getOriginalPrice() - product.getPrice()) / product.getOriginalPrice() * 100
			);
		}
		
		return new SuperPriceResponseDto(
			product.getId(),
			product.getTitle(),
			product.getOriginalPrice(),
			product.getPrice(),
			calculatedDiscount,
			product.getShippingFee(),
			displayTag,
			product.getImageUrl(),
			product.getLinkUrl()
		);
	}
}
