package com.swj.backend.domain.user.dto;

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
}
