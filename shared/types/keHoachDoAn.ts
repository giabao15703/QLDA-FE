import { I_Admin } from './account';

export interface I_KeHoachDoAN {
    id?: string;
    slSinhVien: number;
    slDoAn: number;
    kyMo: string;
    tgbdDoAn: string;
    tgktDoAn: string;
    tgbdTaoDoAn: string;
    tgktTaoDoAn: string;
    tgbdDangKyDeTai: string;
    tgktDangKyDeTai: string;
    tgbdLamDoAn: string;
    tgktLamDoAn: string;
    tgbdChamPhanBien: string;
    tgktChamPhanBien: string;
    tgbdChamHoiDong: string;
    tgktChamHoiDong: string;
    admin: I_Admin;
}
