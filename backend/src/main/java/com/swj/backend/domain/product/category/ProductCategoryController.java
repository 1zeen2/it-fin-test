package com.swj.backend.domain.product.category;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/product/categories")
@RequiredArgsConstructor
public class ProductCategoryController {

	private final ProductCategoryService productCategoryService;
	
	@GetMapping
	public ResponseEntity<List<ProductCategory>> getCategories() {
		List<ProductCategory> categories = productCategoryService.getActiveCategories();
		return ResponseEntity.ok(categories);
	}
}
