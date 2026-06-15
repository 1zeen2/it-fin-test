package com.swj.backend.domain.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>{
	
	@Query(
		value = """
				SELECT * FROM products
				WHERE category1 = :category1 AND is_active = true
				ORDER BY RAND() LIMIT 12
				""",
		nativeQuery = true
	)
	List<Product> findRandom20ByCategory1(@Param("category1") String category1);
	
}