import { environment as environmentAdmin } from '../../apps/nextpro-admin/src/environments/environment';

export const REST_API_ADMIN_ENDPOINTS = {
    ACCOUNT: {
        BUYER: {
            MAIN_ACCOUNT: {
                EXPORT: environmentAdmin.apiUrl + 'api/export/',
            },
        },
        SUPPLIER: {
            MAIN_ACCOUNT: {
                EXPORT: environmentAdmin.apiUrl + 'api/supplier/export/',
            },
        },
        ADMIN: {
            EXPORT: environmentAdmin.apiUrl + 'api/admin/export/',
        },
    },
    DE_TAI: {
        EXPORT: environmentAdmin.apiUrl + 'api/export-de-tai/',
    },
    MASTER_DATA: {
        CCC: {
            FAMILY_CODE: {
                IMPORT: environmentAdmin.apiUrl + 'api/master-data/import/ccc-family-code',
                EXPORT: environmentAdmin.apiUrl + 'api/master-data/export/ccc-family-code',
            },
            CLUSTER_CODE: {
                IMPORT: environmentAdmin.apiUrl + 'api/master-data/import/ccc-cluster-code',
                EXPORT: environmentAdmin.apiUrl + 'api/master-data/export/ccc-cluster-code',
            },
            SUB_CLUSTER_CODE: {
                IMPORT: environmentAdmin.apiUrl + 'api/master-data/import/ccc-sub-cluster-code',
                EXPORT: environmentAdmin.apiUrl + 'api/master-data/export/ccc-sub-cluster-code',
            },
            DESCRIPTION_CODE: {
                IMPORT: environmentAdmin.apiUrl + 'api/master-data/import/ccc-description-code',
                EXPORT: environmentAdmin.apiUrl + 'api/master-data/export/ccc-description-code',
            },
        },
        PROMOTION_HISTORY: {
            EXPORT: environmentAdmin.apiUrl + 'api/promotion_history/export/',
        },
    },
    COUPON: {
        EXPORT: environmentAdmin.apiUrl + 'api/auction/extract/coupon/',
    },
};
