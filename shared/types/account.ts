import { I_Translation } from './common';
import {
    I_Category,
    I_City,
    I_Country,
    I_Currency,
    I_Gender,
    I_Industry,
    I_IndustrySubSector,
    I_Language,
    I_NumberOfEmployee,
    I_Position,
    I_Promotion,
    I_SubClusterCode,
} from './master-data';
import { I_SicpRegistration } from './sale-scheme';
import { I_User } from './user';

export interface I_Level {
    id?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_SupplierListsTranslation {
    id?: string;
    name?: string;
    languageCode?: string;
    supplierList?: I_SupplierLists[];
}
export interface I_SupplierLists {
    id: string;
    name?: string;
    status?: boolean;
    translations?: I_SupplierListsTranslation[];
}

export interface I_SupplierProduct {
    id?: string;
    productName?: string;
    productImages?: I_SupplierProductImage[];
    initialPrice?: number;
    discountedPrice?: number;
    minimumOrderQuantity?: string;
    originOfProductionCountry?: I_Country;
}

export interface I_SupplierProductImage {
    image?: string;
}

export enum E_ProfileFeatureBuyer {
    BASIC = 'BASIC',
    FLYER = 'FLYER',
    CREW = 'CREW',
    CAPTAIN = 'CAPTAIN',
}

export enum E_ProfileFeatureSupplier {
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
    SPONSOR = 'SPONSOR',
}

export enum E_SicpSupplier {
    UNSECURED = 'UNSECURED',
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
}

export interface I_ProfileFeatures {
    id?: string;
    name?: string;
    freeRegistration?: string;
    quoteSubmiting?: string;
    subUserAccounts?: number;
    helpDesk?: string;
    flashSale?: number;
    product?: number;
    reportYear?: number;
    profileFeaturesType?: number;
    status?: boolean;
}

export interface I_ProfileFeaturesBuyer {
    id?: string;
    name?: string;
    marketResearch?: string;
    rfxYear?: number;
    noEauctionYear?: number;
    helpDesk?: string;
    reportYear?: number;
    subUserAccounts?: number;
    feeEauction?: number;
    totalFeeYear?: number;
    profileFeaturesType?: number;
    status?: boolean;
    rfxAutoNego?: boolean;
}

export interface I_ProfileFeaturesBuyerForm {
    name?: string;
    marketResearch?: string;
    rfxYear?: string;
    noEauctionYear?: string;
    helpDesk?: string;
    reportYear?: string;
    feeEauction?: string;
    totalFeeYear?: string;
    subUserAccounts?: string;
}

export interface I_BuyerIndustry {
    industry?: I_Industry;
}

export interface I_BuyerActivity {
    changedBy?: I_User;
    changedDate?: string;
    reasonManual?: string;
    changedState?: number;
    pk?: number;
}

export interface I_Buyer {
    id?: string;
    user?: I_User;
    companyFullName?: string;
    companyShortName?: string;
    companyLongName?: string;
    companyLogo?: string;
    companyTax?: string;
    companyAddress?: string;
    companyCity?: string;
    companyCountry?: I_Country;
    companyCountryState?: I_City;
    companyNumberOfEmployee?: I_NumberOfEmployee;
    companyWebsite?: string;
    companyReferralCode?: string;
    companyEmail?: string;
    gender?: I_Gender;
    picture?: string;
    phone?: string;
    position?: I_Position;
    level?: I_Level;
    language?: I_Language;
    profileFeatures?: I_ProfileFeaturesBuyer;
    currency?: I_Currency;
    promotion?: I_Promotion;
    validFrom?: string;
    validTo?: string;
    sendMail30Day?: string;
    sendMail15Day?: string;
    sendMail7Day?: string;
    sendMailExpire?: string;
    buyerActivity?: {
        edges?: {
            node?: I_BuyerActivity;
        }[];
    };
    buyerIndustry?: {
        edges?: {
            node?: I_BuyerIndustry;
        }[];
    };
    email?: string;
    shortName?: string;
    fullName?: string;
    username?: string;
    userType?: number;
    created?: string;
    firstName?: string;
    lastName?: string;
    pk?: number;
}

export interface I_BuyerSubAccountsActivity {
    changedBy?: I_User;
    changedDate?: string;
    reasonManual?: string;
    changedState?: number;
    pk?: number;
}

export interface I_BuyerSubAccount {
    id?: string;
    user?: I_User;
    buyer?: I_Buyer;
    gender?: I_Gender;
    phone?: string;
    language?: I_Language;
    position?: I_Position;
    picture?: string;
    currency?: I_Currency;
    buyerSubAccountsActivity?: {
        edges?: {
            node?: I_BuyerSubAccountsActivity;
        }[];
    };
    email?: string;
    shortName?: string;
    fullName?: string;
    username?: string;
    userType?: number;
    created?: string;
    firstName?: string;
    lastName?: string;
    companyWebsite?: string;
    companyLongName?: string;
    companyShortName?: string;
}

export interface I_SupplierCategory {
    id?: string;
    category?: I_Category;
    percentage?: number;
    minimumOfValue?: number;
}

export interface I_SupplierIndustry {
    industrySubSectors?: I_IndustrySubSector;
    percentage?: number;
}

export interface I_ClientFocus {
    id?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}

export interface I_SupplierClientFocus {
    id?: string;
    clientFocus?: I_ClientFocus;
    percentage?: number;
}
export interface I_SupplierSubClusterCode {
    subClusterCode: I_SubClusterCode;
    minimumOfValue: number;
    percentage: number;
}

export interface I_SupplierActivity {
    changedBy?: I_User;
    changedDate?: string;
    reasonManual?: string;
    changedState?: number;
    pk?: number;
}

export interface I_Portfolio {
    id?: string;
    company?: string;
    projectName?: string;
    value?: number;
    projectDescription?: string;
    image?: string;
}

export interface I_Supplier {
    id?: string;
    user?: I_User;
    companyFullName?: string;
    companyShortName?: string;
    companyLongName?: string;
    companyTax?: string;
    companyLogo?: string;
    companyAddress?: string;
    companyCity?: string;
    companyCountry?: I_Country;
    companyCountryState?: I_City;
    companyCeoOwnerName?: string;
    companyCeoOwnerEmail?: string;
    companyNumberOfEmployee?: I_NumberOfEmployee;
    companyWebsite?: string;
    companyCredentialProfile?: string;
    companyReferralCode?: string;
    companyTagLine?: string;
    companyDescription?: string;
    companyEstablishedSince?: number;
    companyAnniversaryDate?: string;
    gender?: I_Gender;
    phone?: string;
    position?: I_Position;
    level?: I_Level;
    picture?: string;
    imageBanner?: string;
    language?: I_Language;
    currency?: I_Currency;
    bankName?: string;
    bankCode?: string;
    bankAddress?: string;
    beneficiaryName?: string;
    switchBicCode?: string;
    bankAccountNumber?: string;
    bankCurrency?: I_Currency;
    internationalBank?: string;
    supplierFormRegistration?: string;
    bankCertification?: string;
    qualityCertification?: string;
    businessLicense?: string;
    taxCertification?: string;
    others?: string;
    profileFeatures?: I_ProfileFeatures;
    sicpRegistration?: I_SicpRegistration;
    promotion?: I_Promotion;
    validFrom?: string;
    validTo?: string;
    sendMail30Day?: string;
    sendMail15Day?: string;
    sendMail7Day?: string;
    sendMailExpire?: string;
    viewed?: number;
    order?: number;
    supplierActivity?: {
        edges?: {
            node?: I_SupplierActivity;
        }[];
    };
    suppliercategorySet?: {
        edges?: {
            node?: I_SupplierCategory;
        }[];
    };
    supplierindustrySet?: {
        edges?: {
            node?: I_SupplierIndustry;
        }[];
    };
    supplierclientfocusSet?: {
        edges?: {
            node?: I_SupplierClientFocus;
        }[];
    };
    supplierProducts?: {
        edges?: {
            node?: I_SupplierProduct;
        }[];
    };
    supplierPortfolio?: {
        edges?: {
            node?: I_Portfolio;
        }[];
    };
    supplierSubClusterCode?: I_SupplierSubClusterCode;
    certificate?: {
        created?: string;
        id?: string;
        file?: string;
        name?: string;
        type?: string;
        size?: string;
    }[];
    email?: string;
    shortName?: string;
    fullName?: string;
    username?: string;
    userType?: number;
    created?: string;
    firstName?: string;
    lastName?: string;
    pk?: number;
    isFollowed?: boolean;
}

export interface I_SupplierSubAccountsActivity {
    edges?: {
        node?: {
            changedBy?: I_User;
            changedDate?: string;
            reasonManual?: string;
            changedState?: number;
            pk?: number;
        };
    }[];
}

export interface I_SupplierSubAccount {
    id?: string;
    user?: I_User;
    supplier?: I_Supplier;
    gender?: I_Gender;
    phone?: string;
    language?: I_Language;
    position?: I_Position;
    picture?: string;
    currency?: I_Currency;
    supplierSubAccountsActivity?: I_SupplierSubAccountsActivity;
    email?: string;
    shortName?: string;
    fullName?: string;
    username?: string;
    userType?: number;
    created?: string;
    firstName?: string;
    lastName?: string;
    companyWebsite?: string;
    companyLongName?: string;
    companyShortName?: string;
}

export interface I_SupplierProfile {
    profile?: {
        supplier?: {
            edges?: {
                node?: I_BuyerSubAccount;
            }[];
        };
    };
}

export interface I_Group {
    id?: string;
    name?: string;
}

export interface I_GroupPermission {
    id?: string;
    group?: I_Group;
    role?: number;
}

export interface I_UserPermission {
    id?: string;
    permission?: I_GroupPermission;
    validFrom?: string;
    validTo?: string;
    status?: number;
    usersubstitutionpermissionSet?: I_UserSubstitutionPermission;
    pk?: number;
}

export interface I_UserSubstitutionPermission {
    id?: string;
    userPermission?: I_GroupPermission;
    validFrom?: string;
    validTo?: string;
    user?: I_User;
    status?: number;
    pk?: number;
}

export interface I_Admin {
    id?: string;
    user?: I_User;
    longName?: string;
    picture?: string;
    email?: string;
    shortName?: string;
    fullName?: string;
    username?: string;
    userType?: number;
    created?: string;
    firstName?: string;
    lastName?: string;
    companyWebsite?: string;
    companyLongName?: string;
    companyShortName?: string;
    language?: I_Language;
    role?: E_Role| AdminRole;
}

export enum E_Role {
    A_1 = 1,
    A_2 = 2,
    A_3 = 3,
}

export enum AdminRole {
    A_1 = 1,
    A_2 = 2,
    A_3 = 3,
}

export interface I_ClientFocus {
    id?: string;
    name?: string;
    status?: boolean;
    translations?: I_Translation[];
}
