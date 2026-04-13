package com.swj.backend.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 20)
    private String loginId;
    
    @Column(length = 100)
    private String pwd;
    
    @Column(unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 30)
    private String name;
    
    @Column(length = 30)
    private String nickname;
    
    @Column(nullable = false, length = 8)
    private String birth;
    
    @Column(nullable = false, length = 20)
    private String telecom;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private Gender gender; // "M" 또는 "F"
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Nationality nationality; // "LOCAL" or "FOREIGN"

    @Column(nullable = false, length = 15)
    private String phone;
    
    @Column(length = 1000)
    private String profileImageUrl;
    
    /**
     * 1페이지: 서비스 약관 동의 
     * 	동의 또는 동의하지 않음이라는 값이 반드시 있어야 하므로 
     * 	nullable = false
     */
    @Column(nullable = false) private Boolean termsAgreed;    // 필수
    @Column(nullable = false) private Boolean realnameAgreed; // 선택
    @Column(nullable = false) private Boolean locationAgreed; // 선택
    @Column(nullable = false) private Boolean privacyAgreed;  // 선택
    @Column(nullable = false) private Boolean eventAgreed;    // 선택

    // 2페이지: 본인 인증 약관 동의
    @Column(nullable = false) private Boolean authTermsAgreed; // 필수

    @Column(nullable = false, length = 15)
    private String provider;

    @Column(length = 100)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime lastLoggedIn;

    @Builder
    public User(
    		String loginId, String pwd, String email,
    		String name, String nickname, String birth, String telecom,
    		Gender gender, Nationality nationality,
    		String phone, String profileImageUrl, 
            Boolean termsAgreed, Boolean realnameAgreed, Boolean locationAgreed,
            Boolean privacyAgreed, Boolean eventAgreed,
            Boolean authTermsAgreed,
            String provider, String providerId, Role role
        ) {
    	this.loginId = loginId;
    	this.pwd = pwd;
    	this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.birth = birth;
        this.telecom = telecom;
        this.gender = gender;
        this.nationality = nationality;
        this.phone = phone;
        this.profileImageUrl = profileImageUrl;
        
        // 약관 세팅 (null 방지)
        this.termsAgreed = termsAgreed != null ? termsAgreed : false;
        this.realnameAgreed = realnameAgreed != null ? realnameAgreed : false;
        this.locationAgreed = locationAgreed != null ? locationAgreed : false;
        this.privacyAgreed = privacyAgreed != null ? privacyAgreed : false;
        this.eventAgreed = eventAgreed != null ? eventAgreed : false;
        this.authTermsAgreed = authTermsAgreed != null ? authTermsAgreed : false;
        
        this.provider = provider != null ? provider : "LOCAL";
        this.role = role != null ? role : Role.USER;
        this.providerId = providerId;
    }
    
    public void encodePassword(String encodedPwd) {
        this.pwd = encodedPwd;
    }
    
    public void updatedLastLoggedIn() {
    	this.lastLoggedIn = LocalDateTime.now();
    }
    
}