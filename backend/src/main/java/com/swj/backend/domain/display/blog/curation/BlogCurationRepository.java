package com.swj.backend.domain.display.blog.curation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BlogCurationRepository extends JpaRepository<BlogCuration, Long>{

	@Query(
		"""
		SELECT DISTINCT bc
		FROM BlogCuration bc
		JOIN FETCH bc.curationProducts cp
			JOIN FETCH cp.product
		WHERE bc.isActive = true
		ORDER BY bc.id DESC
		"""
	)
	List<BlogCuration> findByIsActiveTrue();
}
