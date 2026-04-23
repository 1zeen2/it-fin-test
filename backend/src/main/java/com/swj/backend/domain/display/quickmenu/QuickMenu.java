package com.swj.backend.domain.display.quickmenu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quick_menus")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuickMenu {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, length = 50)
	private String name;
	
	@Column(nullable = false)
	private String imageUrl;
	
	@Column(nullable = false, length = 1000)
	private String linkUrl;
	
	@Column(nullable = false, length = 50)
	private String menuCode;
	
	@Column
	private Integer displayOrder;
	
	@Column
	private Boolean isActive;

}
