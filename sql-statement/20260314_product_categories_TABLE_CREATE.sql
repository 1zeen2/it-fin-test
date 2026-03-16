use lafenice_db;

CREATE TABLE product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,            
  image_url VARCHAR(255) NOT NULL,      
  category_code VARCHAR(50) NOT NULL,   
  display_order INT DEFAULT 0,          
  is_active TINYINT(1) DEFAULT 1        -- 1: 노출, 0: 숨김 (데이터 삭제 방지용 소프트 제어)
);

INSERT INTO product_categories 
  (name, image_url, category_code, display_order, is_active) 
VALUES
  ('메가위크', 'https://shop-phinf.pstatic.net/20260305_74/1772688288248aeNBU_GIF/EAB080ECA084EAB080EAB5AC%2BEBA994EAB080EC9C84ED81AC_ED80.gif?type=f305_305', '메가위크', 1, 1),
  ('봄옷초특가', 'https://shop-phinf.pstatic.net/20260305_254/1772670221256sWsXM_PNG/EC84A0ECB0A9EC889CECBFA0ED8FB0_EC9DB4EB9E9CEB939C.png?type=f156_png', '봄옷초특가', 2, 1),
  ('웨딩클럽', 'https://shop-phinf.pstatic.net/20260309_152/1773027536748d04Sb_PNG/ED80B5_EBA781ED81AC%2B28429.png?type=f156_png', '웨딩클럽', 3, 1),
  ('오늘끝딜', 'https://shop-phinf.pstatic.net/20260306_120/17727586762776i4tb_GIF/EC98A4EB8A98EB819DEB949C_ED80B5EBA781ED81AC_260313.gif?type=f305_305', '오늘끝딜', 4, 1),
  ('컬리N마트', 'https://shop-phinf.pstatic.net/20260313_123/1773386934779L36LO_PNG/favicon_ECBBACEBA6ACNEBA788ED8AB8.png?type=f156_png', '컬리N마트', 5, 1),
  ('슈퍼특가', 'https://shop-phinf.pstatic.net/20260313_128/1773386977907x9wHh_PNG/favicon_EC8A88ED8DBCED8AB9EAB080.png?type=f156_png', '슈퍼특가', 6, 1),
  ('스토어랭킹', 'https://shop-phinf.pstatic.net/20260313_298/1773386916435PH76P_PNG/favicon_EC8AA4ED86A0EC96B4EB9EADED82B9.png?type=f156_png', '스토어랭킹', 7, 1),
  ('여행N', 'https://shop-phinf.pstatic.net/20260313_109/1773386952739KpNR3_PNG/favicon_EC97ACED9689N.png?type=f156_png', '여행N', 8, 0),
  ('쇼핑라이브', 'https://shop-phinf.pstatic.net/20260313_213/1773387269046Xcsg5_PNG/favicon_EC87BCED9591EB9DBCEC9DB4EBB88C.png?type=f156_png', '쇼핑라이브', 9, 0),
  ('N배송', 'https://shop-phinf.pstatic.net/20260313_208/1773387446618gSzWn_PNG/favicon_NEBB0B0EC86A1.png?type=f156_png', 'N배송', 10, 0),
  ('지금배달', 'https://shop-phinf.pstatic.net/20260313_281/17733875477922LVlc_PNG/favicon_ECA780EAB888EBB0B0EB8BAC.png?type=f156_png', '지금배달', 11, 0),
  ('슈퍼적립', 'https://shop-phinf.pstatic.net/20260313_259/17733874673791Dqt2_PNG/favicon_EC8A88ED8DBCECA081EBA6BD.png?type=f156_png', '슈퍼적립', 12, 0),
  ('BEST', 'https://shop-phinf.pstatic.net/20260313_232/1773387512074jAdPc_PNG/favicon_BEST.png?type=f156_png', 'BEST', 13, 0),
  ('하이엔드', 'https://shop-phinf.pstatic.net/20260313_152/1773387302040SVAu7_PNG/favicon_ED9598EC9DB4EC9794EB939C.png?type=f156_png', '하이엔드', 14, 0);
  
  commit;
  select * from product_categories;
  
  ALTER TABLE product_categories MODIFY COLUMN id BIGINT AUTO_INCREMENT;