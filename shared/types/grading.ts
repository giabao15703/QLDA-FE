import { I_DeTai } from './deTai';
import { I_GroupQLDA } from './group';

export interface I_Grading {
    id?: string;
    detai: I_DeTai;
    diemHuongdan?: number;
    diemPhanbien?: number;
}

export interface I_GradingForm {
    detai?: string;
    diemHuongdan?: number;
    diemPhanbien?: number;
}
