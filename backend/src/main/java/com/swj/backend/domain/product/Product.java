package com.swj.backend.domain.product;

import com.swj.backend.domain.seller.Seller;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "seller_id", nullable = false)
	private Seller seller;
	
	@Column(length = 50)
	private String productCode;
	
	@Column(nullable = false, length = 255)
	private String title;
	
	private Integer originalPrice;
	
	@Column(nullable = false)
	private int price;
	
	@Column(nullable = false)
	private int shippingFee;
	
	@Column(length = 1000)
	private String imageUrl;
	
	@Column(length = 1000)
	private String linkUrl;
	
	@Column(length = 100)
	private String brand;
	
	@Column(length = 50)
	private String category1;
	
	@Column(length = 50)
	private String category2;
	
	@Column(length = 50)
	private String category3;
	
	@Column(length = 50)
	private String category4;
	
	@Column(nullable = false)
	private boolean isActive;
	
	@Builder
	public Product (
			Seller seller,
			String productCode,
			String title,
			Integer originalPrice,
			int price,
			int shippingFee,
            String imageUrl,
            String linkUrl,
            String brand, 
            String category1,
            String category2,
            String category3,
            String category4
    ) {
		this.seller = seller;
        this.productCode = productCode;
        this.title = title;
        this.originalPrice = originalPrice;
        this.price = Math.max(price, 0); // 가격이 음수면 0으로 설정
        this.shippingFee = Math.max(shippingFee, 0); // 배송비가 0이면 0으로 설정
        this.imageUrl = imageUrl;
        this.linkUrl = linkUrl;
        this.brand = brand;
        this.category1 = category1;
        this.category2 = category2;
        this.category3 = category3;
        this.category4 = category4;
        this.isActive = true;
	}
}
