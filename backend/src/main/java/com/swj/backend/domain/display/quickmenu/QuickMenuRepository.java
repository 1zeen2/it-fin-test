package com.swj.backend.domain.display.quickmenu;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuickMenuRepository extends JpaRepository<QuickMenu, Long> {

    List<QuickMenu> findByIsActiveTrueOrderByDisplayOrderAsc();
    
}