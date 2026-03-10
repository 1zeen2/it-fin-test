package com.swj.backend.domain.user.dto;

import com.swj.backend.domain.user.Gender;
import com.swj.backend.domain.user.Nationality;
import com.swj.backend.domain.user.User;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserSignupDto {

	private String loginId;
    private String pwd;
    private String email;
    private String name;
    private String birth;
    private String telecom;
    private Gender gender;
    private Nationality nationality;
    private String phone;

    // 1페이지 서비스 약관
    private Boolean termsAgreed;
    private Boolean realnameAgreed;
    private Boolean locationAgreed;
    private Boolean privacyAgreed;
    private Boolean eventAgreed;
    
    // 2페이지 인증 약관
    private Boolean authTermsAgreed;
    
    public User toEntity() {
        return User.builder()
                .loginId(this.loginId)
                .pwd(this.pwd)
                .email(this.email)
                .name(this.name)
                .birth(this.birth)
                .telecom(this.telecom)
                .gender(this.gender)
                .nationality(this.nationality)
                .phone(this.phone)
                .authTermsAgreed(this.authTermsAgreed)
                .termsAgreed(this.termsAgreed)
                .realnameAgreed(this.realnameAgreed)
                .locationAgreed(this.locationAgreed)
                .privacyAgreed(this.privacyAgreed)
                .eventAgreed(this.eventAgreed)
                .build();
    }
}
