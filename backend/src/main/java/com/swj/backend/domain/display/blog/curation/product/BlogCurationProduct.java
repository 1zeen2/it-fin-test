package com.swj.backend.domain.display.blog.curation.product;

import com.swj.backend.domain.display.blog.curation.BlogCuration;
import com.swj.backend.domain.product.Product;

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
@Table(name = "blog_curation_products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BlogCurationProduct {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "blog_curation_id", nullable = false)
	private BlogCuration blogCuration;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;
	
	@Column(nullable = false)
	private int displayOrder;
	
	@Builder
    public BlogCurationProduct(
		BlogCuration blogCuration,
		Product product,
		int displayOrder
	) {
        this.blogCuration = blogCuration;
        this.product = product;
        this.displayOrder = displayOrder;
    }
	
}
