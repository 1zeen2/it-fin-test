USE naver_shopping;

ALTER TABLE product_categories RENAME TO quick_menus;

ALTER TABLE quick_menus RENAME COLUMN category_code TO menu_code;

ALTER TABLE quick_menus 
ADD COLUMN link_url VARCHAR(1000) NULL AFTER image_url;
commit;