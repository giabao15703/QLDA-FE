import { I_User } from './user';

export interface I_DeTai {
    id?: string;
    giangVien?: I_User;
    tenDeTai?: string;
    moTa?: string;
    giangVienFullName?: string;
}
