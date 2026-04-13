use lafenice_db;

CREATE TABLE sellers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '판매자 고유 식별자',
    
    user_id BIGINT NOT NULL UNIQUE COMMENT 'users 테이블 PK',

    shop_name VARCHAR(100) NOT NULL COMMENT '브랜드명',
    ceo_name VARCHAR(50) NOT NULL COMMENT '대표자명',
    contact_number VARCHAR(20) NOT NULL COMMENT '고객센터 연락처',

    -- 비즈니스/물류 타입
    seller_type VARCHAR(20) NOT NULL DEFAULT 'INDIVIDUAL' COMMENT '개인 or 기업 (INDIVIDUAL, CORPORATE)',
    business_registration_number VARCHAR(20) UNIQUE COMMENT '사업자등록번호 (기업인 경우에만)',
    shipping_location_type VARCHAR(20) NOT NULL DEFAULT 'DOMESTIC' COMMENT '국내, 해외 배송 (DOMESTIC, INTERNATIONAL)',

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '상점 상태 (ACTIVE, SUSPENDED)',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- 외래키(FK) 제약조건
    CONSTRAINT fk_seller_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='판매자 비즈니스 테이블';