
INSERT INTO hero_banners (
    title, 
    link_url, 
    bg_image_webp, 
    bg_image_fallback, 
    title_image_webp, 
    title_image_fallback, 
    main_text,
    sub_text, 
    products_json, 
    display_order, 
    is_active
) VALUES (
    '3월 5일부터 19일까지 LG전자 새봄맞이 설레이는 특별 할인 찬스',
    'https://shopping.naver.com/festa/onsale/play/699d300e5c71581a19be6768',
    'https://shop-phinf.pstatic.net/20260304_81/1772601853112GEBcu_JPEG/20260226_3EC9B94_EC8388EBB484EBA79EEC9DB4LGECA084EC9E90ED.jpg?type=a1600_webp_q80',
    'https://shop-phinf.pstatic.net/20260304_81/1772601853112GEBcu_JPEG/20260226_3EC9B94_EC8388EBB484EBA79EEC9DB4LGECA084EC9E90ED.jpg',
    NULL,
    NULL,
    'LG전자 새봄맞이',
    '설레는 봄날의 특별 할인 찬스',
    '[
        {
            "webp": "https://shop-phinf.pstatic.net/20251222_87/1766365097385RATii_JPEG/3240529372770754_1265395554.jpg?type=w240_webp_q80",
            "fallback": "https://shop-phinf.pstatic.net/20251222_87/1766365097385RATii_JPEG/3240529372770754_1265395554.jpg"
        },
        {
            "webp": "https://shop-phinf.pstatic.net/20260227_94/1772179309729oFVzL_JPEG/3881025596099390_1133275250.jpg?type=w240_webp_q80",
            "fallback": "https://shop-phinf.pstatic.net/20260227_94/1772179309729oFVzL_JPEG/3881025596099390_1133275250.jpg"
        }
    ]',
    9,
    1
);
commit;

select * from hero_banners;