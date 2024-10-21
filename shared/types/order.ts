import { I_Buyer, I_Supplier } from './account';
import { I_City, I_Voucher } from './master-data';
import { I_Product } from './product';
import { I_User } from './user';

export const enum E_OrderType {
    KCS = 'KCS',
    WARRANTY = 'WARRANTY',
}

export const enum E_OrderStatus {
    CART = 'CART',
    INITIATED = 'INITIATED',
    PENDING = 'PENDING',
    DELIVERING = 'DELIVERING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    PAID = 'PAID',
}

export interface I_OrderDeliveryTimeline {
    id?: string;
    time?: string;
    orderDate?: string;
    date?: Date;
}

export interface I_OrderItem {
    id?: string;
    order?: E_OrderType;
    product?: I_Product;
    taxGTGT?: number;
    createdAt?: Date;
    updatedAt?: Date;
    refund?: number;
    amount?: number;
}

export interface I_Order {
    status(id: string, status: any): unknown;
    id?: string;
    buyer?: I_Buyer;
    supplier?: I_Supplier;
    orderType?: E_OrderType;
    orderCode?: string;
    orderStatus?: E_OrderStatus;
    taxCode?: string;
    createdAt?: Date;
    orderDeliveryTimelines?: I_OrderDeliveryTimeline[];
    orderItems?: I_OrderItem[];
    address?: string;
    voucherCodeOrder?: I_Voucher;
    city?: I_City;
    totalAmount: number;
}
export interface I_GroupStudent {
    id?: string;
    nameGroup?: string;
    members: I_User;
    giangVien: I_GiangVien;
}
export interface I_GiangVien {
    id?: string;
    nameGiangVien: string;
    detai?: string;
    groupStudent: I_GroupStudent;
}
