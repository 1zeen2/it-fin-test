package com.swj.backend.domain.category;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductCategoryService {
	
	private final ProductCategoryRepository productCategoryRepository;
	
	@Transactional
	public List<ProductCategory> getActiveCategories() {
		return productCategoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
	}
}
