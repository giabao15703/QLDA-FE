import { I_Buyer, I_Supplier, I_UserPermission, I_UserSubstitutionPermission } from './account';

export interface I_User {
    id?: string;
    password?: string;
    lastLogin?: string;
    isSuperuser?: boolean;
    created?: string;
    modified?: string;
    username?: string;
    isStaff?: boolean;
    isActive?: boolean;
    userType?: number;
    email?: string;
    activateToken?: string;
    activateTime?: string;
    firstName?: string;
    lastName?: string;
    status?: number;
    shortName?: string;
    fullName?: string;
    localTime?: string;
    companyPosition?: number;
    supplier?: I_Supplier;
    buyer?: I_Buyer;
    userspermissionSet?: {
        edges?: {
            node?: I_UserPermission;
        }[];
    };
    usersubstitutionpermissionSet?: {
        edges?: {
            node?: I_UserSubstitutionPermission;
        }[];
    };
}
