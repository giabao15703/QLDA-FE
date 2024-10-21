import { I_City } from './master-data';
import { I_User } from './user';

export interface I_Transporter {
    id?: string;
    shortName?: string;
    longName?: string;
    code?: string;
    tax?: string;
    phone?: string;
    address?: string;
    email?: string;
    status?: boolean;
}

export interface I_TransporterForm {
    shortName?: string;
    longName?: string;
    code?: string;
    tax?: string;
    phone?: string;
    address?: string;
    email?: string;
    status?: boolean;
}

export interface I_DeliveryResponsible {
    id?: string;
    transporterCode?: I_Transporter;
    cityCode?: I_City;
    effectiveDate?: string;
    status?: boolean;
}

export interface I_DeliveryResponsibleForm {
    transporterCode?: {
        value?: string;
    };
    cityCode?: {
        value?: string;
    };
    effectiveDate?: string;
    status?: boolean;
}

export interface I_ShippingFee {
    id?: string;
    pickUpCity?: I_City;
    destinationCity?: I_City;
    weight?: number;
    fee?: number;
    status: boolean;
}

export interface I_ShippingFeeForm {
    pickUpCityName?: {
        value?: string;
    };
    destinationCityName?: {
        value?: string;
    };
    weight?: number;
    fee?: number;
    status?: boolean;
}
