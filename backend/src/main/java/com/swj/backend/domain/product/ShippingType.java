package com.swj.backend.domain.product;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ShippingType {
    FREE,
    PAID,
    PAY_ON_DELIVERY,
    CONDITIONAL
}
