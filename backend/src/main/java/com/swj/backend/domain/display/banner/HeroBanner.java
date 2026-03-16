package com.swj.backend.domain.display.banner;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonRawValue;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hero_banners")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HeroBanner {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 500)
    private String linkUrl;

    @Column(nullable = false, length = 500)
    private String bgImageWebp;

    @Column(nullable = false, length = 500)
    private String bgImageFallback;

    @Column(length = 500)
    private String titleImageWebp;

    @Column(length = 500)
    private String titleImageFallback;

    @Column(length = 100)
    private String mainText;

    @Column(length = 200)
    private String subText;

    // DB의 JSON 문자열을 이스케이프(\") 없이 순수 JSON 객체 배열로 프론트에 전달.
    @JsonRawValue
    @Column(columnDefinition = "json")
    private String productsJson;

    @Column(nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Column(insertable = false, updatable = false)
    private LocalDateTime updatedAt;
	
}
