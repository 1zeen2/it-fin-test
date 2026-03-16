use lafenice_db;

CREATE TABLE today_promotions (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
	image_url VARCHAR(500) NOT NULL,
    badge_text varchar(50) COMMENT '뱃지 텍스트 (예: 브랜드 DAY, 최대 특가, 등)',
    badge_bg_color varchar(50) COMMENT '뱃지 텍스트 bg',
    highlight_text VARCHAR(50) COMMENT '타이틀 앞 강조 텍스트 (뱃지 텍스트가 없는 경우에만 출력)',
    link_url VARCHAR(500) NOT NULL,
    start_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '이벤트(특가) 시작 일시 ',
    end_at DATETIME NOT NULL COMMENT '이벤트(특가) 종료 일시 (개인 프로젝트이므로 넉넉하게 1년 설정)',
    display_order INT DEFAULT 0 COMMENT '정렬 순서',
    is_active TINYINT(1) DEFAULT 1 COMMENT '화면 출력 여부'
);

INSERT INTO today_promotions (
	title,
    image_url,
    badge_text,
    badge_bg_color,
    highlight_text,
    link_url,
    start_at,
    end_at,
    display_order,
    is_active
) VALUES 
('설화수 구매 고객 진생 페이셜 솝 증정', 'https://shop-phinf.pstatic.net/20260311_285/1773215713789HHA58_JPEG/EC9E87EAB1B8_226x226.jpg?type=w500_webp_q80', '브랜드 DAY', '#7346f3', NULL, 'https://brand.naver.com/sulwhasoo/shoppingstory/detail?id=5002507928', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 0, 1),
('AHC 포레 이레이저 세럼+리필', 'https://shop-phinf.pstatic.net/20260311_63/1773215763296vpYYl_JPEG/EC9E87EAB1B8_226x226.jpg?type=w500_webp_q80', NULL, NULL, '오늘 마감', 'https://brand.naver.com/ahcshop/shoppingstory/detail?id=5002595742', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 1, 1),
('홈앤힐 데이베드 선착순 쿠폰까지', 'https://shop-phinf.pstatic.net/20260311_138/1773215843476dWIDl_JPEG/1_3.jpg?type=w500_webp_q80', NULL, NULL, '46%↓', 'https://shopping.naver.com/festa/onsale/69804478bedb1409a249c6d1', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 2, 1),
('G7 커피 1+1 특별 구성 ~59%↓', 'https://shop-phinf.pstatic.net/20260311_277/177321592232599jUv_JPEG/2ECB0A8-EC8DB86.jpg?type=w500_webp_q80', '단하루', '#7346f3', NULL, 'https://brand.naver.com/trungnguyenkorea/shoppingstory/detail?id=5002589929', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 3, 1),
('전라도식 깻잎김치 9,900원 파격가', 'https://shop-phinf.pstatic.net/20260313_159/1773372586781CM3Ru_JPEG/EC9B90EC81A0EB949C3ECB0A8.jpg?type=w500_webp_q80', '오늘끝딜', '#7346f3', NULL, 'https://shopping.naver.com/promotion?type=WAFFLE&index=0&layerId=L_260220111816672&first=12237533946', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 4, 1),
('매일유업 소화가 잘 되는 우유 할인', 'https://shop-phinf.pstatic.net/20260311_211/1773216233075afwht_JPEG/1ECB0A8-EC8DB88.jpg?type=w500_webp_q80', '슈퍼적립', '#7346f3', NULL, 'https://shopping.naver.com/festa/onsale/brand/699bf58698f1530c6f40d8b1', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 5, 1),
('마뗑킴 네이버 최대 49% 세일', 'https://shop-phinf.pstatic.net/20260313_221/1773371563389sM32m_JPEG/3ECB0A8-EC8DB82.jpg?type=w500_webp_q80', NULL, NULL, '여기서만', 'https://shopping.naver.com/festa/onsale/68d4d4844b6b981fb2dcd1c4', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 6, 1),
('클라비스 26SS 촉감 니트 3만 원대', 'https://shop-phinf.pstatic.net/20260313_278/1773372183102DiQPK_JPEG/3ECB0A8-EC8DB81.jpg?type=w500_webp_q80', '신상위크', '#7346f3', NULL, 'https://brand.naver.com/clovis/shoppingstory/detail?id=5002561485', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 7, 1),
('LG 프라엘 오늘만 핑크 크림 증정', 'https://shop-phinf.pstatic.net/20260313_108/1773371233556TuPEC_JPEG/EC9E87EAB1B8_226x226.jpg?type=w500_webp_q80', '역대급', '#7346f3', NULL, 'https://brand.naver.com/lgpral/shoppingstory/detail?id=5002585158', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 8, 1),
('우고래빗 햇 마카다미아 500+500g', 'https://shop-phinf.pstatic.net/20260311_245/1773216125406v6W8u_JPEG/2ECB0A8-EC8DB89.jpg?type=w500_webp_q80', '신선페스타', '#7346f3', NULL, 'https://shopping.naver.com/festa/onsale/food/699d616d98f1530c6f415fbd', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 9, 1),
('데일리 도시락통 세트 1만 원대', 'https://shop-phinf.pstatic.net/20260311_7/1773216251776LFc1n_JPEG/1ECB0A8-EC8DB86.jpg?type=w500_webp_q80', NULL, NULL, '라이징템', 'https://shopping.naver.com/festa/onsale/living/694101bff4287351877448da', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 10, 1),
('한샘 다시없는 ~48% 외 추가 할인', 'https://shop-phinf.pstatic.net/20260311_169/1773216045924l9AWj_JPEG/EC9E87EAB1B8_226x226.jpg?type=w500_webp_q80', '자정까지', '#7346f3', NULL, 'https://brand.naver.com/hanssemmall/shoppingstory/detail?id=5002575572', '2026-03-15 00:00:00', '2027-03-14 23:59:59', 11, 1);

commit;

select * from today_promotions;