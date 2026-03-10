use lafenice_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'PK',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '사용자 이메일 (NN, UQ)',
    name VARCHAR(30) NOT NULL COMMENT '사용자 실명 (NN)',
    login_id VARCHAR(20) UNIQUE COMMENT '로컬 로그인 아이디 (8~20자)',
    pwd VARCHAR(100) COMMENT '암호화된 비밀번호 (BCrypt 대응)',
    phone VARCHAR(15) NOT NULL COMMENT '연락처 (NN)',
    address VARCHAR(150) NOT NULL COMMENT '기본 주소 (NN)',
    detail_address VARCHAR(150) COMMENT '상세 주소 (선택)',
    is_terms_agreed TINYINT NOT NULL COMMENT '이용약관 동의 여부',
    is_privacy_agreed TINYINT NOT NULL COMMENT '개인정보 처리방침 동의 여부',
    is_marketing_agreed TINYINT NOT NULL DEFAULT 0 COMMENT '마케팅 수신 동의 여부',
    provider VARCHAR(15) NOT NULL DEFAULT 'LOCAL' COMMENT '가입 경로 (LOCAL, GOOGLE 등)',
    provider_id VARCHAR(100) COMMENT 'SNS 고유 식별자',
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER' COMMENT '권한 (ROLE_USER, ROLE_ADMIN)',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일자',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일자',
    last_logged_in DATETIME DEFAULT NULL COMMENT '마지막 로그인 일자'
) 
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_0900_ai_ci 
COMMENT = '사용자 계정 정보 테이블';