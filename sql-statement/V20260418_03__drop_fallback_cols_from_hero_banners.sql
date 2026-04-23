use naver_shopping;

ALTER TABLE hero_banners
DROP COLUMN bg_image_fallback,
DROP COLUMN title_image_fallback;

select * from hero_banners;