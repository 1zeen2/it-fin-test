package com.swj.backend.domain.product.keyword;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrendingKeywordService {

	private final TrendingKeywordRepository trendingKeywordRepository;
	private final RestTemplate restTemplate;
	
	/** minProductCount 수정 시 서버를 끄고 수정 후 재시작하는 문제가 생기지 않게 하기 위해 환경 변수에서 동적으로 값을 주입 */
	@Value("${trend.keyword.min-product-count:15}")
	private int minProductCount;
	
	@Transactional
	public void recordSearchKeyword(String rawKeyword) {
		if (rawKeyword == null || rawKeyword.trim().isEmpty()) {
			return;
		}
		
		String keyword = rawKeyword.trim();
		String normalizedKeyword = keyword.replaceAll("\\s+", "");
		LocalDate today = LocalDate.now();
		
		// 기존 데이터가 존재하는지 확인
		Optional<TrendingKeyword> existingKeyword = 
				trendingKeywordRepository.findByNormalizedKeywordAndBaseDate(normalizedKeyword, today);
		
		// 이미 존재하는 키워드면 SearchCount++ 후 바로 리턴
		if (existingKeyword.isPresent()) {
			existingKeyword.get().incrementSearchCount();
			return;
		}
		
		NaverProductInfo productInfo = scrapeFirstProductInfo(keyword);
		
		// 네이버에 아예 없거나, 상품 개수가 15개 미만인 경우 return
		if (productInfo == null || productInfo.totalCount() < minProductCount) {
			
			// DB에서 오늘 검색된 키워드를 가져와 오타 교정(레벤슈타인)을 시도
			List<String> existingKeywords = trendingKeywordRepository.findAllNormalizedKeywordsByBaseDate(today);
			String correctedKeyword = autoCorrectKeyword(normalizedKeyword, existingKeywords);
			
			// 교정에 성공하면 count++, 실패하면 log 남기고 return
			if (!correctedKeyword.equals(normalizedKeyword)) {
				trendingKeywordRepository.findByNormalizedKeywordAndBaseDate(correctedKeyword, today)
					.ifPresent(TrendingKeyword::incrementSearchCount);
			} else {
				log.info("상품 개수 부족 및 유효하지 않은 검색어 차단 (키워드: {})", keyword);
			}
			return;
			
		}
		
		String linkUrl = "https://search.shopping.naver.com/search/all?query=" 
		         + URLEncoder.encode(keyword, StandardCharsets.UTF_8);
		
		// UPSERT
		trendingKeywordRepository.upsertSearchKeyword(
				keyword, normalizedKeyword, productInfo.imageUrl(), linkUrl, today
		);
	}
	
	/** 입력된 검색어와 DB의 기존 검색어를 비교해 오타를 교정함. */
	private String autoCorrectKeyword(String userInput, List<String> trendingKeywords) {
		String bestMatch = userInput;
		int minDistance = Integer.MAX_VALUE;
		
		// 글자 수에 따라 허용하는 오타 개수 조절 (4글자 이하는 1글자만, 그 이상은 2글자 허용)
		int threshold = userInput.length() <= 4 ? 1 : 2;

		for (String validWord : trendingKeywords) {
			int distance = calculateLevenshteinDistance(userInput, validWord);

			if (distance <= threshold && distance < minDistance) {
				minDistance = distance;
				bestMatch = validWord;
			}
		}
		return bestMatch;
	}
	
	/** 레벤슈타인 거리 알고리즘 (동적 계획법) */
	private int calculateLevenshteinDistance(String a, String b) {
		if (a.isEmpty()) return b.length();
		if (b.isEmpty()) return a.length();

		int[][] dp = new int[a.length() + 1][b.length() + 1];

		for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
		for (int j = 0; j <= b.length(); j++) dp[0][j] = j;

		for (int i = 1; i <= a.length(); i++) {
			for (int j = 1; j <= b.length(); j++) {
				int cost = (a.charAt(i - 1) == b.charAt(j - 1)) ? 0 : 1;
				dp[i][j] = Math.min(
					Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1), 
					dp[i - 1][j - 1] + cost                       
				);
			}
		}
		return dp[a.length()][b.length()];
	}
	
	/** 네이버 쇼핑 API를 호출하여 총 상품 개수와 썸네일 이미지를 하나의 DTO(record)로 반환 */
	private NaverProductInfo scrapeFirstProductInfo(String keyword) {
		String clientId = "ScU3MDGP2SstvKtzL3Ux"; 
		String clientSecret = "pAzDkcOhrU";
		
		try {
			URI uri = UriComponentsBuilder.fromUriString("https://openapi.naver.com/v1/search/shop.json")
					.queryParam("query", keyword)
					.queryParam("display", 1)
					.build()
					.encode(StandardCharsets.UTF_8)
					.toUri();
			
			HttpHeaders headers = new HttpHeaders();
			headers.set("X-Naver-Client-Id", clientId);
			headers.set("X-Naver-Client-Secret", clientSecret);
			HttpEntity<String> entity = new HttpEntity<>(headers);
			
			ResponseEntity<Map> response = restTemplate.exchange(uri, HttpMethod.GET, entity, Map.class);
			
			if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
				Map<String, Object> body = response.getBody();
				
				// 상품 총 개수 파싱
				Integer total = (Integer) body.get("total");
				int totalCount = (total != null) ? total : 0;
				
				List<Map<String, Object>> items = (List<Map<String,Object>>) body.get("items");
				if (items == null || items.isEmpty()) {
					return new NaverProductInfo(totalCount, getPlaceholderUrl(keyword));
				}
				
				String imageUrl = (String) items.get(0).get("image");
				if (imageUrl == null || imageUrl.isBlank()) {
					imageUrl = getPlaceholderUrl(keyword);
				}
				
				// DTO(Record)에 담아서 반환
				return new NaverProductInfo(totalCount, imageUrl);
			}
		} catch (Exception e) {
			log.warn("네이버 쇼핑 API 호출 실패 (키워드: {}): {}", keyword, e.getMessage());
		}
		
		return null;
	}
	
	private String getPlaceholderUrl(String keyword) {
		return "https://via.placeholder.com/200?text=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8);
	}
	
	/** 어제 날짜 기준으로 조회 */
	@Transactional(readOnly = true)
	public List<TrendingKeyword> getYesterdayTrendingKeywords() {
//		데이터를 편하게 보기 위해 임시로 오늘 날짜로 수정
//		LocalDate yesterday = LocalDate.now().minusDays(1);
//		return trendingKeywordRepository.fintTop10TrendingKeywords(yesterday);
		
		LocalDate today = LocalDate.now();
		return trendingKeywordRepository.findTop10TrendingKeywords(today);
	}
	
	/** 일회용 DTO (클래스 선언과 동시에 필드, 생성자, Getter 자동 생성 및 불변성 보장) */
	private record NaverProductInfo(int totalCount, String imageUrl) {}
	
}
