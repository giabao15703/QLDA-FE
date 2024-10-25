import { I_GiangVien } from './giangvien';
import { I_User } from './user'; // Assuming you have a user interface defined

export interface I_GroupQLDA {
    id?: string;
    maNhom?: string;
    name?: string;
    deTai?: string;
    status?: boolean;
}
