export const ROUTES = {
    ADMIN: {
        ROOT: 'admin',
        MASTER_DATA: {
            COUNTRY: 'admin/master-data/country',
        },
    },
    USER: {
        AUTH: {
            ROOT: 'auth',
            REGISTER: {
                THANK_YOU: 'auth/register/thank-you',
                BECOME_BUYER: 'auth/register/become-buyer',
                BECOME_SUPPLIER: 'auth/register/become-supplier',
            },
        },

        PROJECT_REGISTRATION: {
            ROOT: 'project-registration',
        },

        DASHBOARD: {
            ROOT: 'dashboard',
        },
        GROUP: {
            ROOT: 'group',
        },
        GROUP_REGISTRATION: {
            ROOT: 'group-registration',
        },
        NOTIFICATION: {
            ROOT: 'notification',
        },
        PRODUCT: {
            ROOT: 'product',
            SEARCH: 'product/search',
            DETAIL: 'product/:id',
        },
        REQUIREMENT: {
            ROOT: 'rfx',
        },
        EAUCTION: {
            ROOT: 'e-auction',
        },
        SUPPLIER: {
            ROOT: 'supplier',
            SEARCH: 'supplier/search',
            PROFILE: 'supplier/:id',
            DETAIL: 'supplier/detail/:id',
            PRODUCT: {
                ROOT: 'supplier/product',
            },
            PAYMENT: {
                ROOT: 'payment/payment-account',
            },
            ORDER: {
                ROOT: 'purchase-order/supplier',
            },
        },
        BUYER: {
            ROOT: 'buyer',
            // SEARCH: 'buyer/search',
            PROFILE: 'buyer/:id',
            // PRODUCT: {
            //     ROOT: 'supplier/product',
            //     CREATE: 'supplier/product/create',
            // },
            PAYMENT: {
                ROOT: 'payment/payment-account',
            },
            ORDER: {
                ROOT: 'purchase-order/buyer',
            },
        },
        BUYER_CLUB: {
            ROOT: 'buyer-club',
        },
        CART: {
            ROOT: 'cart',
        },
        PAYMENT: {
            ROOT: 'payment',
            MY_ACCOUNT: 'my-account',
            PENDING_PAYMENT: 'pending-payment',
        },
        TOPUP: {
            ROOT: 'payment/top-up',
        },
        ORDER: {
            ROOT: 'order',
            BUYER: 'order/buyer',
            SUPPLIER: 'order/supplier',
            TRANSPORTER: 'order/transporter',
            DETAIL: {
                ROOT: 'order/:id',
                CANCEL: 'order/:id/cancel',
            },
        },
        PRODUCT_SET_ADVERTISING: {
            ROOT: 'product-set-advertising',
        },
    },
};
