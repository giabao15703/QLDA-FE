import { I_Admin } from './account';
import { I_User } from './user';

export interface I_DeTai {
    id?: string;
    idgvhuongdan?: I_Admin;
    idgvphanbien?: I_Admin | null;
    tendoan?: string;
    chuyennganh?: string;
    mota: string;
    trangthai?: string;
    yeucau?: string;
    idKeHoach?: string;
    giangVienLongName?: string;
    keHoachDoAnId?: string;
    giangVienPhanBienLongName?: string;
}
