package com.swj.backend.domain.product;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getProducts(@RequestParam("category1") String category1) {
        List<ProductResponseDto> products = productService.getProductsByCategory(category1);
        
        return ResponseEntity.ok(products);
    }
}
