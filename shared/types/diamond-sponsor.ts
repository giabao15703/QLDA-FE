import { I_User } from './user';

export interface I_UserDiamondSponsor {
    id?: string;
    image?: string;
    productName?: string;
    description?: string;
    validFrom?: string;
    validTo?: string;
    user?: I_User;
    status?: number;
    isActive?: boolean;
    isConfirmed?: number;
    textEditer?: string;
    reachNumber?: number;
    clickNumber?: number;
    reachNumberCount?: number;
    icon?: string;
}

export interface I_UserDiamondSponsorForm {
    image?: string;
    productName?: string;
    description?: string;
    validFrom?: string;
    validTo?: string;
    companyFullName?: string;
    isActive?: boolean;
    isConfirmed?: number;
}
