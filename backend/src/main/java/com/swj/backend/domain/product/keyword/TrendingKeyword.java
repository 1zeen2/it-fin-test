package com.swj.backend.domain.product.keyword;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trending_keywords")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TrendingKeyword {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, length = 100)
	private String keyword;
	
	@Column(nullable = false, length = 100)
	private String normalizedKeyword;
	
	@Column(nullable = false, length = 500)
	private String imageUrl;
	
	@Column(nullable = false, length = 500)
	private String linkUrl;
	
	@Column(nullable = false)
	private Integer searchCount;
	
	@Column(nullable = false)
	private LocalDate baseDate;
	
	@Column
	private Boolean isActive;
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
	
}
