package com.swj.backend.domain.display.superprice;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swj.backend.domain.product.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SuperPriceService {

	private final ProductRepository productRepository;
	private final SuperPriceRepository superPriceRepository;
	
	public List<SuperPriceResponseDto> getSuperPriceProducts() {
		List<SuperPrice> superPrices = superPriceRepository.findAll();
		
		if (superPrices.isEmpty()) return Collections.emptyList();
		
		List<SuperPrice> shuffleSuperPrices = new ArrayList<>(superPrices);
		Collections.shuffle(shuffleSuperPrices);
		
		List<SuperPrice> selectedSuperPrices = shuffleSuperPrices
				.stream()
				.limit(18)
				.toList();
		
		Map<Long, String> tagMap = selectedSuperPrices.stream()
				.collect(Collectors.toMap(SuperPrice::getProductId, SuperPrice::getDisplayTag));
		
		List<SuperPriceResponseDto> targetProducts = productRepository
				.findAllById(tagMap.keySet())
				.stream()
				.map(product -> SuperPriceResponseDto.from(product, tagMap.get(product.getId())))
				.collect(Collectors.toList());
		
		Collections.shuffle(targetProducts);
		
		return targetProducts;
	}
}
