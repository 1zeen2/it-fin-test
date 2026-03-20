use lafenice_db;

CREATE TABLE trending_keywords (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    keyword VARCHAR(100) NOT NULL COMMENT '화면에 출력되는 키워드',
    normalized_keyword VARCHAR(100) NOT NULL COMMENT '공백/특수문자가 제거된 집계용 키워드',
    
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500) NOT NULL,
    
    search_count INT DEFAULT 0 COMMENT '일일 누적 검색 회수 (이 값이 랭킹 산정 값이 됨)',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    base_date DATE NOT NULL COMMENT '랭킹 기준 일자',
    is_active TINYINT(1) DEFAULT 1 COMMENT '출력 여부',
    
    
    UNIQUE KEY uk_normalized_date (normalized_keyword, base_date)
);
CREATE INDEX idx_base_date ON trending_keywords(base_date);

INSERT INTO trending_keywords (
keyword, normalized_keyword, image_url, link_url, search_count, base_date, is_active 
) VALUES 
('니카 키링', '니카키링', 'https://shopping-phinf.pstatic.net/main_8431887/84318879094.22.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EB%8B%88%ED%82%A4%ED%82%A4%EB%A7%81', 0, '2026-03-16', 1),
('발렌시아가 로데오 백', '발렌시아가로데오백', 'https://shopping-phinf.pstatic.net/main_8755136/87551363144.6.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EB%8B%88%ED%82%A4%ED%82%A4%EB%A7%81', 0, '2026-03-16', 1),
('불가리 세르펜티', '불가리세르펜티', 'https://shopping-phinf.pstatic.net/main_8905642/89056426980.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EB%B6%88%EA%B0%80%EB%A6%AC%EC%84%B8%EB%A5%B4%ED%8E%9C%ED%8B%B0', 0, '2026-03-16', 1),
('부케 말리기 선물', '부케말리기선물', 'https://shopping-phinf.pstatic.net/main_8326508/83265089322.4.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EB%B6%80%EC%BC%80%EB%A7%90%EB%A6%AC%EA%B8%B0%EC%84%A0%EB%AC%BC', 0, '2026-03-16', 1),
('더로우 마고백', '더로우마고백', 'https://shopping-phinf.pstatic.net/main_8862168/88621685790.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EB%8D%94%EB%A1%9C%EC%9A%B0%EB%A7%88%EA%B3%A0%EB%B0%B1', 0, '2026-03-16', 1),
('유니클로 배기 커브 진', '유니클로배기커브진', 'https://shopping-phinf.pstatic.net/main_8959347/89593474962.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EC%9C%A0%EB%8B%88%ED%81%B4%EB%A1%9C%EB%B0%B0%EA%B8%B0%EC%BB%A4%EB%B8%8C%EC%A7%84', 0, '2026-03-16', 1),
('립살리스', '립살리스', 'https://shopping-phinf.pstatic.net/main_8959360/89593607898.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EB%A6%BD%EC%82%B4%EB%A6%AC%EC%8A%A4', 0, '2026-03-16', 1),
('에스쁘아 선크림', '에스쁘아선크림', 'https://shopping-phinf.pstatic.net/main_8763809/87638094440.18.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EC%97%90%EC%8A%A4%EC%81%98%EC%95%84%EC%84%A0%ED%81%AC%EB%A6%BC', 0, '2026-03-16', 1),
('구동화', '구동화', 'https://shopping-phinf.pstatic.net/main_8917661/89176616629.2.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%EA%B5%AC%EB%8F%99%ED%99%94', 0, '2026-03-16', 1),
('프라다 로퍼', '프라다로퍼', 'https://shopping-phinf.pstatic.net/main_8879610/88796100987.1.jpg?type=f450', 'https://search.shopping.naver.com/ns/search?query=%ED%94%84%EB%9D%BC%EB%8B%A4%EB%A1%9C%ED%8D%BC', 0, '2026-03-16', 1);

select * from trending_keywords;