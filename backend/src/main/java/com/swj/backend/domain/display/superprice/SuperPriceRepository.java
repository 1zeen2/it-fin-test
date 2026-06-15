package com.swj.backend.domain.display.superprice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuperPriceRepository extends JpaRepository<SuperPrice, Long>{
	
}
