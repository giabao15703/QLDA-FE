import { I_User } from './user';

export interface I_GroupQLDA {
    id?: string;
    maNhom?: string;
    name?: string;
    status?: boolean;
    memberCount?: number;
}
export interface I_JoinGroup {
    id?: string;
    user?: I_User;
    group?: I_GroupQLDA;
    membersCount?: number;
}
export interface I_JoinRequest {
    id?: string;
    user?: I_User;
    group?: I_GroupQLDA;
    isApproved?: boolean;
    createdAt?: string;
    membersCount?: number;
}
