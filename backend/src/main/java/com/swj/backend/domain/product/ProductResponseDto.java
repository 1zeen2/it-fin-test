package com.swj.backend.domain.product;

import lombok.Getter;

@Getter
public class ProductResponseDto {

	private final Long id;
    private final String imageUrl;
    private final String linkUrl;
    private final String title;
    private final Integer originalPrice;
    private final int price;
    private final ShippingType shippingType;
    private final int shippingFee;
    private final String category1;
    
    public ProductResponseDto(Product product) {
    	this.id = product.getId();
        this.imageUrl = product.getImageUrl();
        this.linkUrl = product.getLinkUrl();
        this.title = product.getTitle();
        this.originalPrice = product.getOriginalPrice();
        this.price = product.getPrice();
        this.shippingType = product.getShippingType();
        this.shippingFee = product.getShippingFee();
        this.category1 = product.getCategory1();
    }
    
}
