package com.swj.backend.domain.banner;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HeroBannerRepository extends JpaRepository<HeroBanner, Long>{
	
	/** is_active column이 1인(true) 데이터만 ASC 후 가져옴 */
	List<HeroBanner> findAllByIsActiveTrueOrderByDisplayOrderAsc();
	
}
