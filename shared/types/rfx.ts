import { I_Supplier } from './account';
import { I_Translation } from './common';
import { I_Category, I_City, I_Country, I_Currency, I_DeliveryTerm, I_PaymentTerm } from './master-data';
import { I_User } from './user';

export interface I_ContractType {
    id?: string;
    name?: string;
    status?: boolean;
    translations: I_Translation[];
}

export interface I_Rfx {
    id?: string;
    itemCode?: string;
    rfxType?: number;
    title?: string;
    budget?: number;
    currency?: I_Currency;
    category?: I_Category;
    dueDate?: string;
    contractType?: I_ContractType;
    fromDate?: string;
    toDate?: string;
    paymentTerm?: I_PaymentTerm;
    deliveryTerm?: I_DeliveryTerm;
    deliveryAddress?: string;
    termsAndConditions?: boolean;
    otherRequirement?: string;
    noteForSupplier?: string;
    status?: number;
    user?: I_User;
    splitOrder?: number;
    maxSupplier?: number;
    supplierJoinedAmount?: number;
    quoteStatus?: number;
    created?: string;
    emailDate?: string;
    isSend?: boolean;
    isFull?: boolean;
    timeViewMinutes?: number;
    autoNegotiation?: boolean;
    country?: I_Country;
    countryState?: I_City;
    isNextRound?: boolean;
    awardedSuppliers?: I_Supplier[];
    subAmount?: number;
    bestBid?: number;
    saving?: number;
    savingPercentage?: number;
}
