package com.swj.backend.domain.user.dto;

import com.swj.backend.domain.user.User;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserSignUpDto {

	private String email;
    private String name;
    private String loginId;
    private String pwd;
    private String phone;
    private String address;
    private String detailAddress;
    
    private Boolean isTermsAgreed;
    private Boolean isPrivacyAgreed;
    private Boolean isMarketingAgreed;
    
    public User toEntity() {
        return User.builder()
                .email(this.email)
                .name(this.name)
                .loginId(this.loginId)
                .pwd(this.pwd)
                .phone(this.phone)
                .address(this.address)
                .detailAddress(this.detailAddress)
                .isTermsAgreed(this.isTermsAgreed)
                .isPrivacyAgreed(this.isPrivacyAgreed)
                .isMarketingAgreed(this.isMarketingAgreed)
                .build();
    }
}
