import { I_DeTai } from './deTai';
import { I_User } from './user';
export enum E_RequyestType {
    INVITE = 'invite',
    JOIN_REQUEST = 'joinRequest',
}

export interface I_GroupQLDA {
    id?: string;
    maNhom?: string;
    name?: string;
    deTai?: I_DeTai;
    status?: boolean;
    memberCount?: number;
    maxMember?: number;
    creatorShortName?: string;
}
export interface I_JoinGroup {
    id?: string;
    user?: I_User;
    group?: I_GroupQLDA;
    role?: string;
}
export interface I_JoinRequest {
    id?: string;
    user?: I_User;
    group?: I_GroupQLDA;
    isApproved?: boolean;
    createdAt?: string;
    membersCount?: number;
    requestType?: string;
    leaderUserId?: number;
}
