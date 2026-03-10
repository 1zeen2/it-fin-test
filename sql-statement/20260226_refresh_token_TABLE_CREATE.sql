use lafenice_db;

CREATE TABLE refresh_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '토큰 고유 식별자',
    user_id BIGINT NOT NULL COMMENT '토큰을 소유한 유저의 ID',
    token VARCHAR(500) NOT NULL UNIQUE COMMENT '실제 리프레시 토큰 값',
    expires_at DATETIME NOT NULL COMMENT '토큰 만료 일시',
    
    -- 유저 정보가 사라지면 해당 유저의 토큰도 DB에서 자동으로 지워지도록 CASCADE를 걸어둠.
    CONSTRAINT fk_refresh_token_user 
        FOREIGN KEY (user_id) 
        REFERENCES users (id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

commit;

SELECT * FROM users;