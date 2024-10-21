export interface I_ProfileFeaturesSupplier {
    id?: string;
    name?: string;
    freeRegistration?: string;
    quoteSubmiting?: string;
    rfxrReceivingPriority?: number;
    subUserAccounts?: number;
    helpDesk?: string;
    flashSale?: number;
    product?: number;
    reportYear?: number;
    baseRateMonth?: number;
    baseRateFullYear?: number;
    profileFeaturesType?: number;
    status?: boolean;
}

export interface I_ProfileFeaturesSupplierForm {
    name?: string;
    freeRegistration?: string;
    quoteSubmiting?: string;
    rfxrReceivingPriority?: string;
    subUserAccounts?: string;
    helpDesk?: string;
    flashSale?: string;
    product?: string;
    reportYear?: string;
    baseRateMonth?: string;
    baseRateFullYear?: string;
}

export interface I_SicpRegistration {
    id?: string;
    name?: string;
    legalStatus?: number;
    bankAccount?: number;
    sanctionCheck?: number;
    certificateManagement?: number;
    dueDiligence?: number;
    financialRisk?: number;
    totalAmount?: number;
    sicpType?: number;
    status?: boolean;
}

export interface I_SicpRegistrationForm {
    name?: string;
    legalStatus?: string;
    bankAccount?: string;
    sanctionCheck?: string;
    certificateManagement?: string;
    dueDiligence?: string;
    financialRisk?: string;
    totalAmount?: string;
}

export interface I_AuctionFee {
    id?: string;
    minValue?: number;
    maxValue?: number;
    percentage?: number;
}

export interface I_AuctionFeeForm {
    minValue?: string;
    maxValue?: string;
    percentage?: string;
}

export interface I_PlatformFee {
    id?: string;
    title?: string;
    fee?: number;
}

export interface I_PlatformFeeForm {
    title?: string;
    fee?: string;
}

export interface I_UserDiamondSponsorFee {
    id?: string;
    title?: string;
    fee?: number;
}

export interface I_UserDiamondSponsorFeeForm {
    title?: string;
    fee?: string;
}

export enum E_SicpType {
    BANK_ACCOUNT = 1,
    CERTIFICATION_MANAGEMENT = 2,
    DUE_DILIGENCE = 3,
    FINANCIAL_RISK_MANAGEMENT = 4,
    LEGAL_STATUS = 5,
    DOCUMENT_INTERNAL = 6,
    DOCUMENT_EXTERNAL = 7,
    SANCTION_CHECK = 8,
}

export interface I_SupplierSicpTextEditor {
    id?: string;
    textEditerEn?: string;
    textEditerVi?: string;
    sicpType?: number;
}
