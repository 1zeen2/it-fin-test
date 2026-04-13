use lafenice_db;

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL COMMENT '판매자 테이블 PK',
    product_code VARCHAR(50) COMMENT '판매자가 자체 관리하는 상품 코드',

    title VARCHAR(255) NOT NULL COMMENT '상품명',
    price INT NOT NULL DEFAULT 0 COMMENT '판매가',
    image_url VARCHAR(1000) COMMENT '상품 썸네일 URL',
    link_url VARCHAR(1000) COMMENT '원본 상품 링크',
    brand VARCHAR(100) COMMENT '브랜드명',

    -- 카테고리
    category1 VARCHAR(50) COMMENT '대분류',
    category2 VARCHAR(50) COMMENT '중분류',
    category3 VARCHAR(50) COMMENT '소분류',
    category4 VARCHAR(50) COMMENT '세분류',

	-- 설정 관련
    is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '상품 출력 여부 (0 = 숨김, 1 = 출력)',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_category (category1, category2, category3),

    UNIQUE INDEX uk_seller_product_code (seller_id, product_code),

    CONSTRAINT fk_product_seller FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 테이블';
