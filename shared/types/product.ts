import { CategoryNode } from '#shared/graphql/types';
import { I_Supplier, I_SupplierSubClusterCode } from './account';
import { I_City, I_Country, I_Currency, I_PaymentTerm, I_UnitOfMeasure } from './master-data';

export const enum E_ProductConfirmStatus {
    DRAFT = 'DRAFT',
    WAITING = 'WAITING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum E_ProductInventoryStatusInput {
    STOCKING = 'STOCKING',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum E_ProductType {
    PRODUCT = 'PRODUCT',
    FLASH_SALE = 'FLASH_SALE',
}

export interface I_ProductImage {
    edges: {
        node?: {
            id?: number;
            image?: string;
        };
    }[];
}

export interface I_ProductFlashSale {
    edges: {
        node: {
            id?: string;
            initialPrice?: number | null;
            discountedPrice?: number | null;
        };
    }[];
}

export interface I_ProductWholesalePrice {
    edges: {
        node: {
            id?: string;
            qualityFrom?: number;
            qualityTo?: number;
            priceBracket?: number;
            deliveryDays?: number;
        };
    }[];
}

export interface I_Product {
    id?: string;
    discountProgramForm: boolean;
    status: boolean;
    country: I_Country;
    state: I_City;
    regularProduct: boolean;
    greenProduct: boolean;
    officialProduct: boolean;
    currency?: I_Currency;
    skuNumber?: string;
    description?: string;
    type?: E_ProductType;
    productName?: string;
    unitOfMeasure?: I_UnitOfMeasure;
    isVisibility: boolean;
    confirmedStatus?: E_ProductConfirmStatus;
    specification?: string;
    minimumOrderQuantity?: number;
    userSupplier?: I_Supplier;
    paymentTerm?: I_PaymentTerm;
    inventoryStatus?: E_ProductInventoryStatusInput;
    provideAbility?: string;
    support?: string;
    brand?: string;
    originOfProduction?: string;
    originOfProductionCountry?: I_Country;
    guarantee?: string;
    otherInformation?: string;
    reachNumber?: number;
    clickNumber?: number;
    urlPath?: string;
    weight?: number;
    createDate?: string;
    color?: string;
    size?: string;
    height?: number;
    format?: string;
    productImages?: I_ProductImage[];
    productFlashSales?: I_ProductFlashSale[];
    productWholesalePriceList?: I_ProductWholesalePrice[];
    supplierSubClusterCodeList?: I_SupplierSubClusterCode[];
    // supplierProduct?: UserRatingSupplierProductNodeConnection!
    picture?: string;
    initialPrice?: number;
    discountedPrice?: number;
    categoryList: CategoryNode[];
    relatedSupplierProductList?: I_Product[];
    specifications?: I_Specifications;
    productAttributes?: I_Specifications[];
    wholeSalePrice: I_WholeSalePrice[];
}

export interface I_Specifications {
    color: string;
    size: string;
    weight: string;
    height: string;
    images: [string];
}
export interface I_WholeSalePrice {
    qualityFrom: number;
    qualityTo: number;
    priceBracket: string;
    deliveryDays: number;
}
