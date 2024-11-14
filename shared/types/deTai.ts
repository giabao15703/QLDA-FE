import { I_Admin } from './account';
import { I_User } from './user';

export interface I_DeTai {
    id?: string;
    idgvhuongdan?: I_Admin;
    idgvphanbien?: I_Admin;
    tendoan?: string;
    chuyenNganh?: string;
    moTa: string;
    trangThai?: string;
    yeuCau?: string;
    idKeHoach?: string;
}
