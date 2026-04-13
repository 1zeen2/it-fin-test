use naver_shopping;

select * from products;

ALTER TABLE products 
ADD COLUMN original_price INT COMMENT '할인 전 원래 가격 (할인이 없으면 null)',
ADD COLUMN shipping_fee INT NOT NULL DEFAULT 0 COMMENT '배송비';
commit;

ALTER TABLE products 
MODIFY COLUMN original_price INT COMMENT '할인 전 원래 가격 (할인이 없으면 null)' AFTER title;

ALTER TABLE products 
MODIFY COLUMN shipping_fee INT NOT NULL DEFAULT 0 COMMENT '배송비' AFTER price;
commit;

CREATE TABLE blog_curations (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blog_name VARCHAR(50) NOT NULL DEFAULT 'blog',
    author VARCHAR(50) NOT NULL COMMENT '작성자 (예: 비비)',
    post_title VARCHAR(255) NOT NULL COMMENT '블로그 포스트 제목',
    post_thumbnail_url VARCHAR(1000) NOT NULL COMMENT '블로그 썸네일 이미지',
    is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '노출 여부',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE blog_curation_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blog_curation_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    display_order INT NOT NULL DEFAULT 0 COMMENT '큐레이션 내 상품 노출 순서',
    
    CONSTRAINT fk_curation FOREIGN KEY (blog_curation_id) REFERENCES blog_curations(id) ON DELETE CASCADE,
    CONSTRAINT fk_curation_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
commit;