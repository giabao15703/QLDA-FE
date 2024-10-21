import { I_Translation, T_Any } from './common';
import { I_AutoCompleteOption } from './form';

export interface I_Country {
    id?: string;
    itemCode?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_CountryForm {
    name?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_City {
    id?: string;
    name?: string;
    stateCode?: string;
    country?: I_Country;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_CityForm {
    name?: string;
    stateCode?: string;
    country?: string;
    status?: boolean;
}

export interface I_Currency {
    id?: string;
    itemCode?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_CurrencyForm {
    nameEn?: string;
    nameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_DeliveryTerm {
    id?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_DeliveryTermForm {
    nameEn?: string;
    nameVi?: string;
    status?: boolean;
}

export interface I_PaymentTerm {
    id?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_PaymentTermForm {
    nameEn?: string;
    nameVi?: string;
    status?: boolean;
}

export interface I_Reason {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_ReasonForm {
    nameEn?: string;
    nameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_Gender {
    id?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_GenderForm {
    nameEn?: string;
    nameVi?: string;
    status?: boolean;
}

export interface I_Position {
    id?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_PositionForm {
    nameEn?: string;
    nameVi?: string;
    status?: boolean;
}

export interface I_Language {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_LanguageForm {
    nameEn?: string;
    nameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_NumberOfEmployee {
    id?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_NumberOfEmployeeForm {
    name?: string;
    status?: boolean;
}

export interface I_Industry {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    translations?: I_Translation[];
    children?: I_Industry[];
    fetchChildren?: () => void;
    industryCluster?: T_Any;
}

export interface I_IndustryForm {
    industryNameVi?: string;
    industryNameEn?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_IndustryCluster {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    industry?: I_Industry;
    translations?: I_Translation[];
    children?: I_IndustryCluster[];
    fetchChildren?: () => void;
    industrySectors?: T_Any;
}

export interface I_IndustryClusterForm {
    industryNameEn?: I_AutoCompleteOption;
    industryNameVi?: I_AutoCompleteOption;
    industryClusterNameEn?: string;
    industryClusterNameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_IndustrySector {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    industryCluster?: I_IndustryCluster;
    translations?: I_Translation[];
    children?: I_IndustrySector[];
    fetchChildren?: () => void;
    industrySubSectors?: T_Any;
}

export interface I_IndustrySectorForm {
    industryClusterNameEn?: I_AutoCompleteOption;
    industryClusterNameVi?: I_AutoCompleteOption;
    industrySectorNameEn?: string;
    industrySectorNameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_IndustrySubSector {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    industrySectors?: I_IndustrySector;
    translations?: I_Translation[];
}

export interface I_IndustrySubSectorForm {
    industrySectorNameEn?: I_AutoCompleteOption;
    industrySectorNameVi?: I_AutoCompleteOption;
    industrySubSectorNameEn?: string;
    industrySubSectorNameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_UnitOfMeasure {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_UnitOfMeasureForm {
    nameEn?: string;
    nameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_FamilyCode {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    translations?: I_Translation[];
    supplierNumber?: string;
    children?: I_FamilyCode[];
    fetchChildren?: () => void;
    clusterCode?: T_Any;
}

export interface I_FamilyCodeForm {
    familyCodeNameEn?: string;
    familyCodeNameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_ClusterCode {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    translations?: I_Translation[];
    familyCode?: I_FamilyCode;
    children?: I_ClusterCode[];
    fetchChildren?: () => void;
    subClusterCode?: T_Any;
}

export interface I_ClusterCodeForm {
    familyCodeNameEn?: I_AutoCompleteOption;
    familyCodeNameVi?: I_AutoCompleteOption;
    clusterCodeNameEn?: string;
    clusterCodeNameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_SubClusterCode {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    translations?: I_Translation[];
    children?: I_ClusterCode[];
    fetchChildren?: () => void;
    category?: T_Any;
    clusterCode?: T_Any;
}

export interface I_SubClusterCodeForm {
    clusterCodeNameEn?: I_AutoCompleteOption;
    clusterCodeNameVi?: I_AutoCompleteOption;
    subClusterCodeNameEn?: string;
    subClusterCodeNameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_Category {
    id?: string;
    name?: string;
    itemCode?: string;
    status?: boolean;
    translations?: I_Translation[];
    subClusterCode?: T_Any;
    clusterCode?: T_Any;
    familyCode?: T_Any;
}

export interface I_CategoryForm {
    subClusterCodeNameEn?: I_AutoCompleteOption;
    subClusterCodeNameVi?: I_AutoCompleteOption;
    descriptionCodeNameEn?: string;
    descriptionCodeNameVi?: string;
    itemCode?: string;
    status?: boolean;
}

export interface I_EmailTemplate {
    id?: string;
    itemCode?: string;
    title?: string;
    content?: string;
    variables?: string;
    status?: boolean;
    created?: Date;
    updated?: Date;
    translations?: {
        id?: string;
        languageCode?: string;
        title?: string;
        content?: string;
    }[];
}
export interface I_EmailTemplateForm {
    nameEn?: string;
    nameVi?: string;
    itemCode?: string;
    status?: boolean;
}
export interface I_PromotionUser {
    id?: string;
    userUsed?: string;
    userUsedEmail?: string;
}

export interface I_PromotionTranslation {
    id?: string;
    languageCode?: string;
    name?: string;
    description?: string;
}

export interface I_Promotion {
    id?: string;
    name?: string;
    description?: string;
    discount?: number;
    validFrom?: string;
    validTo?: string;
    status?: boolean;
    applyForBuyer?: boolean;
    applyForSupplier?: boolean;
    applyForAdvertisement?: boolean;
    visible?: boolean;
    userGiven?: string;
    userGivenEmail?: string;
    commission?: number;
    applyScope?: string;
    translations?: I_PromotionTranslation[];
    descriptionDefault?: string;
}

export enum E_SupplierPromotionType {
    PROFILE = 'PROFILE',
    SICP = 'SICP',
}

export enum E_PromotionScope {
    FOR_BUYER = 'FOR_BUYER',
    FOR_SUPPLIER = 'FOR_SUPPLIER',
    FOR_SUPPLIER_ALL_SCOPE = 'FOR_SUPPLIER_ALL_SCOPE',
    FOR_SUPPLIER_PROFILE_FEATURES = 'FOR_SUPPLIER_PROFILE_FEATURES',
    FOR_SUPPLIER_SICP = 'FOR_SUPPLIER_SICP',
}

export interface I_PromotionForm {
    name?: string;
    descriptionEn?: string;
    descriptionVi?: string;
    profileFeatures?: boolean;
    sicp?: boolean;
    discount?: number;
    validFrom?: string;
    validTo?: string;
    status?: boolean;
    applyForBuyer?: boolean;
    applyForSupplier?: boolean;
    applyForAdvertisement?: boolean;
    visible?: boolean;
    userGiven?: string;
    userGivenEmail?: string;
    commission?: number;
    applyScope?: E_PromotionScope;
    translations?: I_PromotionTranslation[];
    descriptionDefault?: string;
}

export interface I_PromotionHistory {
    id?: string;
    promotion?: I_Promotion;
    userUsed?: string;
    userUsedEmail?: string;
    userName?: string;
    title?: string;
    dateUsed?: string;
    realAmount?: number;
    amountAfterDiscount?: number;
}
export interface I_Voucher {
    id?: string;
    voucherCode?: string;
    name?: string;
    status?: boolean;
    discount?: number;
    label?: string;
    translations?: I_Translation[];
    pk?: string;
}
export interface I_VoucherForm {
    nameEn?: string;
    nameVi?: string;
    discount?: number;
    label?: string;
    status?: boolean;
    voucherCode?: string;
}
export interface I_WarrantyTerm {
    id?: string;
    warrantyCode?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
    pk?: string;
}
export interface I_WarrantyTermForm {
    nameEn?: string;
    nameVi?: string;
    status?: boolean;
    warrantyCode?: string;
}
export interface I_BuyerClubVoucher {
    voucherCode?: string;
    id?: string;
    description?: string;
    status?: boolean;
    standard?: number;
    gold?: number;
    platinum?: number;
    diamond?: number;
    label?: string;
    translations?: I_Translation[];
    pk?: string;
}
export interface I_BuyerClubVoucherForm {
    voucherCode?: string;
    descriptionEn?: string;
    descriptionVi?: string;
    standard?: number;
    gold?: number;
    platinum?: number;
    diamond?: number;
    label?: string;
    status?: boolean;
}

export interface I_SetProductAdvertisement {
    id?: string;
    description?: string;
    status?: boolean;
    duration?: number;
    serviceFee?: number;
    translations?: I_Translation[];
    pk?: string;
}
export interface I_SetProductAdvertisementForm {
    descriptionEn?: string;
    descriptionVi?: string;
    duration?: number;
    serviceFee?: number;
    status?: boolean;
}
