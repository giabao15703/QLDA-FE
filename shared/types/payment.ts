import { I_User } from './user';

export interface I_UserPayment {
    id?: string;
    user?: I_User;
    onePay?: number;
    bankTransfer?: number;
}

export interface I_BankTransferPaymentOrderAttached {
    id?: string;
    file?: string;
}

export interface I_Bank {
    id?: string;
    itemCode?: string;
    name?: string;
    status?: boolean;
}

export interface I_BankTransfer {
    id?: string;
    bankInformation?: string;
    orderNumber?: string;
    bankAccountNumber?: string;
    dayOfPayment?: string;
    amount?: number;
    auctionNumber?: string;
    paymentsOrderAttached?: {
        edges?: {
            node?: I_BankTransferPaymentOrderAttached;
        }[];
    };
}

export interface I_BankTransferHistory {
    id?: string;
    bankTransfer?: I_BankTransfer;
    isPending?: boolean;
}

export interface I_PaymentAuction {
    id?: string;
    auction?: {
        id?: string;
        status?: number;
    };
    chargeAmount?: number;
    refundAmount?: number;
    walletType?: number;
}

export interface I_HistoryPayment {
    id?: string;
    userPayment?: I_UserPayment;
    orderNo?: string;
    date?: string;
    type?: number;
    transactionDescription?: string;
    balance?: number;
    status?: number;
    invoiceReceipt?: string;
    requestDraftInvoice?: string;
    notes?: string;
    methodPayment?: number;
    amount?: number;
    adminBalance?: number;
    isParent?: boolean;
    bankTransferHistory?: I_BankTransferHistory;
    paymentAuction?: I_PaymentAuction;
    historyPending?: {
        totalPending?: number;
    };
    pk?: number;
    remainAmount?: number;
    supplierStatus?: number;
}

export interface I_HistoryPaymentForm {
    username?: string;
    fullName?: string;
    date?: string;
    bankInformation?: string;
    transactionDescription?: string;
    orderNo?: string;
    balance?: number;
    amount?: number;
    adminBalance?: number;
    methodPayment?: number;
    bankTransferDoc?: string;
    invoiceReceipt?: string;
    draftInvoice?: string;
}

export interface I_HistoryPending {
    id?: string;
    userPayment?: I_UserPayment;
    orderNo?: string;
    date?: string;
    type?: number;
    transactionDescription?: string;
    balance?: number;
    status?: number;
    invoiceReceipt?: string;
    requestDraftInvoice?: string;
    notes?: string;
    methodPayment?: number;
    amount?: number;
    adminBalance?: number;
    isParent?: boolean;
    bankTransferHistory?: I_BankTransferHistory;
    paymentAuction?: I_PaymentAuction;
    pk?: number;
}

export interface I_TopUp {
    no?: number;
    orderNo?: string;
    description?: string;
    roundedTopUpAmount?: number;
    notes?: string;
    totalAmount?: number;
}
