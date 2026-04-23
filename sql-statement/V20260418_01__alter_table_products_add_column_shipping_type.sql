use naver_shopping;

ALTER TABLE products 
ADD COLUMN shipping_type ENUM('FREE', 'PAID', 'PAY_ON_DELIVERY', 'CONDITIONAL') NOT NULL DEFAULT 'FREE' AFTER shipping_fee;

SET SQL_SAFE_UPDATES = 0;

UPDATE products 
SET shipping_type = 'PAID' 
WHERE shipping_fee > 0;

ALTER TABLE products 
ALTER COLUMN shipping_type DROP DEFAULT;

SET SQL_SAFE_UPDATES = 1;

commit;