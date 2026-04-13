package com.swj.backend.domain.keyword;

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
import lombok.Builder;
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
	
	@Builder
	public TrendingKeyword(
			String keyword,
			String normalizedKeyword,
			String imageUrl,
			String linkUrl,
			Integer searchCount,
			LocalDate baseDate,
			Boolean isActive)
	{
		this.keyword = keyword;
		this.normalizedKeyword = normalizedKeyword;
		this.imageUrl = imageUrl;
		this.linkUrl = linkUrl;
		this.searchCount = searchCount != null ? searchCount : 1; // null 방지 기본값
		this.baseDate = baseDate != null ? baseDate : LocalDate.now();
		this.isActive = isActive != null ? isActive : true;
	}
	
	public void incrementSearchCount() {
		this.searchCount++;
	}
	
}
