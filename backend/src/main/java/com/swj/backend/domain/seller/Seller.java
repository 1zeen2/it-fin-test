package com.swj.backend.domain.seller;

import com.swj.backend.domain.user.User;
import com.swj.backend.global.common.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sellers")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Seller extends BaseTimeEntity {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 100)
    private String shopName;

    @Column(nullable = false, length = 50)
    private String ceoName;

    @Column(nullable = false, length = 20)
    private String contactNumber;

    @Column(nullable = false, length = 20)
    private String sellerType;

    @Column(length = 20, unique = true)
    private String businessRegistrationNumber;

    @Column(nullable = false, length = 20)
    private String shippingLocationType;

    @Column(nullable = false, length = 20)
    private String status;

    @Builder
    public Seller(
    		User user,
    		String shopName,
    		String ceoName,
    		String contactNumber, 
            String sellerType,
            String businessRegistrationNumber,
            String shippingLocationType
    ) {
        this.user = user;
        this.shopName = shopName;
        this.ceoName = ceoName;
        this.contactNumber = contactNumber;
        this.sellerType = sellerType != null ? sellerType : "INDIVIDUAL";
        this.businessRegistrationNumber = businessRegistrationNumber;
        this.shippingLocationType = shippingLocationType != null ? shippingLocationType : "DOMESTIC";
        this.status = "ACTIVE";
    }
	
}
