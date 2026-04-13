package com.swj.backend.domain.display.blog.curation;

import java.util.List;
import java.util.stream.Collectors;

import com.swj.backend.domain.display.blog.curation.product.BlogCurationProduct;

public record BlogCurationResponseDto(
	Long curationId,
	String blogName,
	String author,
	String postTitle,
	String postThumbnailUrl,
	String blogUrl,
	List<CurationProductDto> products
) {
	public record CurationProductDto(
		Long productId,
		String title,
		Integer originalPrice,
		int price,
		String imageUrl,
		String linkUrl,
		Integer shippingFee,
		int displayOrder
	) {
		public static CurationProductDto from(BlogCurationProduct cp) {
			return new CurationProductDto(
				cp.getProduct().getId(),
				cp.getProduct().getTitle(),
				cp.getProduct().getOriginalPrice(),
				cp.getProduct().getPrice(),
				cp.getProduct().getImageUrl(),
				cp.getProduct().getLinkUrl(),
				cp.getProduct().getShippingFee(),
				cp.getDisplayOrder()
			);
		};
	}
	
	public static BlogCurationResponseDto from(BlogCuration curation) {
		return new BlogCurationResponseDto(
                curation.getId(),
                curation.getBlogName(),
                curation.getAuthor(),
                curation.getPostTitle(),
                curation.getPostThumbnailUrl(),
                curation.getBlogUrl(),
                curation.getCurationProducts().stream()
                        .map(CurationProductDto::from)
                        .collect(Collectors.toList())
        );
	}
	
}
