package com.swj.backend.domain.product;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;
	
	@Transactional(readOnly = true)
	public List<ProductResponseDto> getProductsByCategory(String category1) {
		return productRepository.findRandom20ByCategory1(category1)
				.stream()
				.map(ProductResponseDto::new)
				.toList();
	}
}