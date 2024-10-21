import { I_ProfileFeaturesBuyer } from './account';
import { I_Language } from './master-data';

export interface I_LoginInput {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface I_RegisterBuyerInput {
    companyFullName: string;
    companyTax: string;
    companyAddress: string;
    companyCity: string;
    companyCountry: string;
    companyCountryState: string;
    companyNumberOfEmployee: string;
    gender: string;
    phone: string;
    position: string;
    currency: string;
    language: string;
    user: {
        password: string;
        email: string;
        fullName: string;
    };
    industries: string;
}

export interface I_InviteInput {
    email: string;
    fullName: string;
    referralCode?: string;
    userType: number;
}

export enum E_UserType {
    ADMIN = 1,
    BUYER = 2,
    SUPPLIER = 3,
}

export interface I_Profile {
    id?: string;
    email?: string;
    shortName?: string;
    fullName?: string;
    username?: string;
    userType?: number;
    created?: Date;
    firstName?: string;
    lastName?: string;
    companyWebsite?: string;
    companyLongName?: string;
    companyShortName?: string;
    companyFullName?: string;
    companyLogo?: string;
    picture?: string;
    language?: I_Language;
    profileFeatures?: I_ProfileFeaturesBuyer;
}
