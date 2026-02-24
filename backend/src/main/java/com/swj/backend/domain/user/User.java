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

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(unique = true, length = 20)
    private String loginId;

    @Column(length = 100)
    private String pwd; // DB 컬럼명 pwd와 일치시킴

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(nullable = false, length = 150)
    private String address;

    @Column(length = 150)
    private String detailAddress;

    @Column(nullable = false)
    private Boolean isTermsAgreed;

    @Column(nullable = false)
    private Boolean isPrivacyAgreed;

    @Column(nullable = false)
    private Boolean isMarketingAgreed;

    @Column(nullable = false, length = 15)
    private String provider;

    @Column(length = 100)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    private LocalDateTime lastLoggedIn; // 신규 추가된 컬럼

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Builder
    public User(String email, String name, String loginId, String pwd, String phone, 
                String address, String detailAddress, Boolean isTermsAgreed, Boolean isPrivacyAgreed, 
                Boolean isMarketingAgreed, String provider, String providerId, Role role) {
        this.email = email;
        this.name = name;
        this.loginId = loginId;
        this.pwd = pwd;
        this.phone = phone;
        this.address = address;
        this.detailAddress = detailAddress;
        this.isTermsAgreed = isTermsAgreed;
        this.isPrivacyAgreed = isPrivacyAgreed;
        this.isMarketingAgreed = isMarketingAgreed != null ? isMarketingAgreed : false;
        this.provider = provider != null ? provider : "LOCAL";
        this.role = role != null ? role : Role.USER;
        this.providerId = providerId;
    }
    
    public void encodePassword(String encodedPwd) {
        this.pwd = encodedPwd;
    }
    
}