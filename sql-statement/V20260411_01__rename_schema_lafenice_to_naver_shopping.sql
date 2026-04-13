-- 1. 새로운 타겟 스키마 생성
CREATE DATABASE IF NOT EXISTS naver_shopping DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. 💡 핵심: 이동 중 외래키 충돌 에러를 막기 위해 일시적으로 검사 해제
SET FOREIGN_KEY_CHECKS = 0;

-- 3. 테이블을 새 스키마로 순간 이동 (데이터, 인덱스, 구조 모두 유지됨)
RENAME TABLE lafenice_db.users TO naver_shopping.users;
RENAME TABLE lafenice_db.sellers TO naver_shopping.sellers;
RENAME TABLE lafenice_db.products TO naver_shopping.products;
RENAME TABLE lafenice_db.refresh_token TO naver_shopping.refresh_token;
RENAME TABLE lafenice_db.hero_banners TO naver_shopping.hero_banners;
RENAME TABLE lafenice_db.product_categories TO naver_shopping.product_categories;
RENAME TABLE lafenice_db.today_promotions TO naver_shopping.today_promotions;
RENAME TABLE lafenice_db.trending_keywords TO naver_shopping.trending_keywords;

-- 4. 💡 원상 복구: 테이블 이동이 끝났으므로 외래키 검사 다시 활성화 (매우 중요)
SET FOREIGN_KEY_CHECKS = 1;

-- 5. 타겟 스키마로 이동하여 확인 준비
USE naver_shopping;
SHOW TABLES;

SELECT * FROM hero_banners;

DROP DATABASE lafenice_db;