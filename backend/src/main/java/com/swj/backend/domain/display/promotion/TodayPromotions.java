package com.swj.backend.domain.display.promotion;

import java.time.LocalDateTime;

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
@Table(name = "today_promotions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TodayPromotions {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String title;
	
	@Column(nullable = false, length = 500)
	private String imageUrl;
	
	@Column(length = 50)
	private String badgeText;
	
	@Column(length = 50)
	private String badgeBgColor;
	
	@Column(length = 50)
	private String highlightText;
	
	@Column(nullable = false, length = 500)
	private String linkUrl;
	
	@Column(nullable = false)
	private LocalDateTime startAt;
	
	@Column(nullable = false)
	private LocalDateTime endAt;
	
	@Column
	private Integer displayOrder;
	
	@Column
	private Boolean isActive;
	
}
