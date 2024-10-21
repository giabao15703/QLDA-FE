export interface I_Coupon {
    id?: string;
    couponProgram?: string;
    description?: string;
    commission?: number;
    validFrom?: string;
    validTo?: string;
    email?: string;
    fullName?: string;
    note?: string;
    status?: boolean;
}

export interface I_CouponForm {
    couponProgram?: string;
    description?: string;
    commission?: string;
    validFrom?: string;
    validTo?: string;
    note?: string;
    fullName?: string;
    email?: string;
    status?: boolean;
}
