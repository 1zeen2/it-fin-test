package com.swj.backend.domain.display.blog.curation;

import java.util.ArrayList;
import java.util.List;

import com.swj.backend.domain.display.blog.curation.product.BlogCurationProduct;
import com.swj.backend.domain.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "blog_curations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BlogCuration {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@Column(nullable = false, length = 50)
	private String blogName;
	
	@Column(nullable = false, length = 50)
	private String author;
	
	@Column(nullable = false, length = 255)
	private String postTitle;
	
	@Column(nullable = false, length = 1000)
	private String postThumbnailUrl;
	
	@Column(nullable = false, length = 1000)
	private String blogUrl;
	
	@Column(nullable = false)
	private boolean isActive;
	
	@OneToMany(mappedBy = "blogCuration", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<BlogCurationProduct> curationProducts = new ArrayList<>();
	
	@Builder
    public BlogCuration(
    	User user,
		String blogName,
		String author,
		String postTitle,
		String postThumbnailUrl,
		String blogUrl
	) {
		this.user = user;
        this.blogName = blogName != null ? blogName : "blog";
        this.author = author;
        this.postTitle = postTitle;
        this.postThumbnailUrl = postThumbnailUrl;
        this.blogUrl = blogUrl;
        this.isActive = true;
    }
	
	
}
