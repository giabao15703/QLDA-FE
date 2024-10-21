import { I_Banner } from './banner';

export interface I_BannerGroup {
    id?: string;
    itemCode?: string;
    name?: string;
    description?: string;
    bannerList?: I_Banner[];
}

export interface I_BannerGroupForm {
    file?: string;
    fileMobile?: string;
    bannerList?: I_Banner[];
    itemCode?: string;
    name?: string;
    description?: string;
}
