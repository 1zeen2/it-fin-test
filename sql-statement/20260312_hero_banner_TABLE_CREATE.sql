use lafenice_db;

CREATE TABLE hero_banners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- 메타 데이터 및 SEO
    title VARCHAR(100) NOT NULL COMMENT 'SEO alt 텍스트 (bg_image의 alt 텍스트)',
    link_url VARCHAR(500) NOT NULL COMMENT '클릭 시 이동할 타겟 URL',
    
    -- 배경 이미지
    bg_image_webp VARCHAR(500) NOT NULL COMMENT '배경 WebP URL',
    bg_image_fallback VARCHAR(500) NOT NULL COMMENT '배경 PNG/JPG URL',
    
    -- 타이틀 로고 이미지 (로고가 텍스트인 경우 NULL)
    title_image_webp VARCHAR(500) DEFAULT NULL COMMENT '타이틀 이미지 WebP URL',
    title_image_fallback VARCHAR(500) DEFAULT NULL COMMENT '타이틀 이미지 PNG/JPG URL',
    
    -- 서브 텍스트 및 배너 이미지 json
    main_text VARCHAR(100) DEFAULT NULL COMMENT '상단 메인 타이틀 (title_image가 null인 경우에만 출력)',
    sub_text VARCHAR(200) DEFAULT NULL COMMENT '중앙 서브 타이틀 ',
    products_json JSON COMMENT '미니 상품 썸네일 배열: [{"webp": "..", "fallback": ".."}]',
    
    -- 관리 로직
    display_order INT NOT NULL DEFAULT 0 COMMENT '화면 노출 순서 (1, 2, 3...)',
    is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '노출 여부 (1: 노출, 0: 숨김)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='히어로 슬라이드 배너';

commit;

