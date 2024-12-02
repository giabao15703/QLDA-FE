import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateAdminGQL,
    CreateAdminMutation,
    CreateAdminMutationVariables,
    CreateBuyerGQL,
    CreateBuyerMutation,
    CreateBuyerMutationVariables,
    CreateBuyerSubAccountGQL,
    CreateBuyerSubAccountMutation,
    CreateBuyerSubAccountMutationVariables,
    CreateSupplierSubAccountGQL,
    CreateSupplierSubAccountMutation,
    CreateSupplierSubAccountMutationVariables,
    GetAdminGQL,
    GetAdminQuery,
    GetAdminQueryVariables,
    GetAdminsGQL,
    GetAdminsQuery,
    GetAdminsQueryVariables,
    GetBuyerGQL,
    GetBuyerQuery,
    GetBuyerQueryVariables,
    GetBuyerSubAccountGQL,
    GetBuyerSubAccountQuery,
    GetBuyerSubAccountQueryVariables,
    GetBuyerSubAccountWithBuyerGQL,
    GetBuyerSubAccountWithBuyerQuery,
    GetBuyerSubAccountWithBuyerQueryVariables,
    GetBuyerSubAccountsGQL,
    GetBuyerSubAccountsQuery,
    GetBuyerSubAccountsQueryVariables,
    GetBuyerSubAccountsWithBuyerGQL,
    GetBuyerSubAccountsWithBuyerQuery,
    GetBuyerSubAccountsWithBuyerQueryVariables,
    GetBuyersGQL,
    GetBuyersQuery,
    GetBuyersQueryVariables,
    GetClientFocusesGQL,
    GetClientFocusesQuery,
    GetClientFocusesQueryVariables,
    GetCoreBusinessCountGQL,
    GetCoreBusinessCountQuery,
    GetCoreBusinessCountQueryVariables,
    GetGroupPermissionsGQL,
    GetGroupPermissionsQuery,
    GetGroupPermissionsQueryVariables,
    GetSupplierGQL,
    GetSupplierListsGQL,
    GetSupplierListsQuery,
    GetSupplierListsQueryVariables,
    GetSupplierProfileGQL,
    GetSupplierProfileQuery,
    GetSupplierProfileQueryVariables,
    GetSupplierQuery,
    GetSupplierQueryVariables,
    GetSupplierSubAccountGQL,
    GetSupplierSubAccountQuery,
    GetSupplierSubAccountQueryVariables,
    GetSupplierSubAccountWithSupplierGQL,
    GetSupplierSubAccountWithSupplierQuery,
    GetSupplierSubAccountWithSupplierQueryVariables,
    GetSupplierSubAccountsGQL,
    GetSupplierSubAccountsQuery,
    GetSupplierSubAccountsQueryVariables,
    GetSupplierSubAccountsWithSupplierGQL,
    GetSupplierSubAccountsWithSupplierQuery,
    GetSupplierSubAccountsWithSupplierQueryVariables,
    GetSuppliersGQL,
    GetSuppliersQuery,
    GetSuppliersQueryVariables,
    GetSuppliersWithProductsGQL,
    GetSuppliersWithProductsQuery,
    GetSuppliersWithProductsQueryVariables,
    GetUserGQL,
    GetUserPermissionsGQL,
    GetUserPermissionsQuery,
    GetUserPermissionsQueryVariables,
    GetUserQuery,
    GetUserQueryVariables,
    GetUsersGQL,
    GetUsersQuery,
    GetUsersQueryVariables,
    UpdateAdminGQL,
    UpdateAdminMutation,
    UpdateAdminMutationVariables,
    UpdateAdminStatusGQL,
    UpdateAdminStatusMutation,
    UpdateAdminStatusMutationVariables,
    UpdateBuyerDetailGQL,
    UpdateBuyerDetailMutation,
    UpdateBuyerDetailMutationVariables,
    UpdateBuyerStatusGQL,
    UpdateBuyerStatusMutation,
    UpdateBuyerStatusMutationVariables,
    UpdateBuyerSubAccountGQL,
    UpdateBuyerSubAccountMutation,
    UpdateBuyerSubAccountMutationVariables,
    UpdateBuyerSubAccountsStatusGQL,
    UpdateBuyerSubAccountsStatusMutation,
    UpdateBuyerSubAccountsStatusMutationVariables,
    UpdateSupplierDetailGQL,
    UpdateSupplierDetailMutation,
    UpdateSupplierDetailMutationVariables,
    UpdateSupplierStatusGQL,
    UpdateSupplierStatusMutation,
    UpdateSupplierStatusMutationVariables,
    UpdateSupplierSubAccountGQL,
    UpdateSupplierSubAccountMutation,
    UpdateSupplierSubAccountMutationVariables,
    UpdateSupplierSubAccountsStatusGQL,
    UpdateSupplierSubAccountsStatusMutation,
    UpdateSupplierSubAccountsStatusMutationVariables,
    UpdateUserPermissionStatusGQL,
    UpdateUserPermissionStatusMutation,
    UpdateUserPermissionStatusMutationVariables,
} from '#shared/graphql/types';
import { GraphqlService } from '#shared/services';
import {
    E_Role,
    I_Admin,
    I_Buyer,
    I_BuyerSubAccount,
    I_ClientFocus,
    I_GraphQLOptions,
    I_Group,
    I_GroupPermission,
    I_MutationResponse,
    I_NormalizeExtra,
    I_Supplier,
    I_SupplierLists,
    I_SupplierProfile,
    I_SupplierSubAccount,
    I_TableState,
    I_User,
    I_UserPermission,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    constructor(
        private graphqlService: GraphqlService,

        private getBuyerGQL: GetBuyerGQL,
        private getBuyersGQL: GetBuyersGQL,
        private updateBuyerDetailGQL: UpdateBuyerDetailGQL,
        private updateBuyerStatusGQL: UpdateBuyerStatusGQL,

        private getBuyerSubAccountGQL: GetBuyerSubAccountGQL,
        private getBuyerSubAccountWithBuyerGQL: GetBuyerSubAccountWithBuyerGQL,
        private getBuyerSubAccountsGQL: GetBuyerSubAccountsGQL,
        private getBuyerSubAccountsWithBuyerGQL: GetBuyerSubAccountsWithBuyerGQL,
        private createBuyerSubAccountGQL: CreateBuyerSubAccountGQL,
        private updateBuyerSubAccountGQL: UpdateBuyerSubAccountGQL,
        private updateBuyerSubAccountsStatusGQL: UpdateBuyerSubAccountsStatusGQL,

        private getSupplierListsGQL: GetSupplierListsGQL,
        private getSupplierGQL: GetSupplierGQL,
        private getSuppliersGQL: GetSuppliersGQL,
        private updateSupplierDetailGQL: UpdateSupplierDetailGQL,
        private getSuppliersWithProductsGQL: GetSuppliersWithProductsGQL,
        private updateSupplierStatusGQL: UpdateSupplierStatusGQL,
        private getSupplierProfileGQL: GetSupplierProfileGQL,

        private getSupplierSubAccountGQL: GetSupplierSubAccountGQL,
        private getSupplierSubAccountWithSupplierGQL: GetSupplierSubAccountWithSupplierGQL,
        private getSupplierSubAccountsGQL: GetSupplierSubAccountsGQL,
        private getSupplierSubAccountsWithSupplierGQL: GetSupplierSubAccountsWithSupplierGQL,
        private getCoreBusinessCountGQL: GetCoreBusinessCountGQL,
        private createSupplierSubAccountGQL: CreateSupplierSubAccountGQL,
        private updateSupplierSubAccountGQL: UpdateSupplierSubAccountGQL,
        private updateSupplierSubAccountsStatusGQL: UpdateSupplierSubAccountsStatusGQL,

        private getUserPermissionsGQL: GetUserPermissionsGQL,
        private updateUserPermissionStatusGQL: UpdateUserPermissionStatusGQL,

        private getGroupPermissionsGQL: GetGroupPermissionsGQL,

        private getAdminGQL: GetAdminGQL,
        private getAdminsGQL: GetAdminsGQL,
        private createAdminGQL: CreateAdminGQL,
        private updateAdminGQL: UpdateAdminGQL,
        private updateAdminStatusGQL: UpdateAdminStatusGQL,

        private getclientFocusesGQL: GetClientFocusesGQL,
        private createBuyerGQL: CreateBuyerGQL,

        private getUsersGQL: GetUsersGQL,
        private getUserGQL: GetUserGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    getSupplierLists = (
        variables?: GetSupplierListsQueryVariables,
        options?: I_GraphQLOptions<GetSupplierListsQuery, I_TableState<I_SupplierLists>>,
        extra?: I_NormalizeExtra,
    ) => {
        return this.graphqlService.query<
            GetSupplierListsQuery,
            GetSupplierListsQueryVariables,
            I_TableState<I_SupplierLists>
        >(this.getSupplierListsGQL, variables, {
            normalize: (data) => normalizeWithPagination<I_SupplierLists>(data.supplierLists, extra),
            ...options,
        }) as Promise<I_TableState<I_SupplierLists>>;
    };

    private normalizeBuyerList = (data: GetBuyersQuery, extra?: I_NormalizeExtra): I_TableState<I_Buyer> => {
        return normalizeWithPagination<I_Buyer>(data.buyers, extra);
    };

    getBuyer = (variables?: GetBuyerQueryVariables, options?: I_GraphQLOptions<GetBuyerQuery, I_Buyer>) => {
        return this.graphqlService.query<GetBuyerQuery, GetBuyerQueryVariables, I_Buyer>(this.getBuyerGQL, variables, {
            normalize: (data) => data.buyer,
            ...options,
        }) as Promise<I_Buyer>;
    };

    getBuyers = (
        variables?: GetBuyersQueryVariables,
        options?: I_GraphQLOptions<GetBuyersQuery, I_TableState<I_Buyer>>,
    ) => {
        return this.graphqlService.query<GetBuyersQuery, GetBuyersQueryVariables, I_TableState<I_Buyer>>(
            this.getBuyersGQL,
            variables,
            {
                normalize: (data) => this.normalizeBuyerList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Buyer>>;
    };

    // #region BUYER MAIN ACCOUNT
    private normalizeUserList = (data: GetUsersQuery, extra?: I_NormalizeExtra): I_TableState<I_User> => {
        return normalizeWithPagination<I_User>(data.users, extra);
    };

    getUser = (variables?: GetUserQueryVariables, options?: I_GraphQLOptions<GetUserQuery, I_User>) => {
        return this.graphqlService.query<GetUserQuery, GetUserQueryVariables, I_User>(this.getUserGQL, variables, {
            normalize: (data) => data.user,
            ...options,
        }) as Promise<I_User>;
    };

    getUsers = (
        variables?: GetUsersQueryVariables,
        options?: I_GraphQLOptions<GetUsersQuery, I_TableState<I_User>>,
    ) => {
        return this.graphqlService.query<GetUsersQuery, GetUsersQueryVariables, I_TableState<I_User>>(
            this.getUsersGQL,
            variables,
            {
                normalize: (data) => this.normalizeUserList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_User>>;
    };

    updateBuyerDetail = (
        variables?: UpdateBuyerDetailMutationVariables,
        options?: I_GraphQLOptions<UpdateBuyerDetailMutation, { buyerDetailUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateBuyerDetailMutation,
            UpdateBuyerDetailMutationVariables,
            { buyerDetailUpdate: I_MutationResponse }
        >(this.updateBuyerDetailGQL, variables, options);
    };

    updateBuyerStatus = (
        variables?: UpdateBuyerStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateBuyerStatusMutation, { buyerStatusUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateBuyerStatusMutation,
            UpdateBuyerStatusMutationVariables,
            { buyerStatusUpdate: I_MutationResponse }
        >(this.updateBuyerStatusGQL, variables, options);
    };
    // #endregion

    // #region BUYER SUB ACCOUNT
    private normalizeBuyerSubAccountsList = (
        data: GetBuyerSubAccountsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_BuyerSubAccount> => {
        return normalizeWithPagination<I_BuyerSubAccount>(data.buyerSubAccounts, extra);
    };

    getBuyerSubAccounts = (
        variables?: GetBuyerSubAccountsQueryVariables,
        options?: I_GraphQLOptions<GetBuyerSubAccountsQuery, I_TableState<I_BuyerSubAccount>>,
    ) => {
        return this.graphqlService.query<
            GetBuyerSubAccountsQuery,
            GetBuyerSubAccountsQueryVariables,
            I_TableState<I_BuyerSubAccount>
        >(this.getBuyerSubAccountsGQL, variables, {
            normalize: (data) => this.normalizeBuyerSubAccountsList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_BuyerSubAccount>>;
    };

    getBuyerSubAccountsWithBuyer = (
        variables?: GetBuyerSubAccountsWithBuyerQueryVariables,
        options?: I_GraphQLOptions<GetBuyerSubAccountsWithBuyerQuery, I_TableState<I_BuyerSubAccount>>,
    ) => {
        return this.graphqlService.query<
            GetBuyerSubAccountsWithBuyerQuery,
            GetBuyerSubAccountsWithBuyerQueryVariables,
            I_TableState<I_BuyerSubAccount>
        >(this.getBuyerSubAccountsWithBuyerGQL, variables, {
            normalize: (data) => this.normalizeBuyerSubAccountsList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_BuyerSubAccount>>;
    };

    createBuyerSubAccount = (
        variables?: CreateBuyerSubAccountMutationVariables,
        options?: I_GraphQLOptions<CreateBuyerSubAccountMutation, { buyerSubAccountsCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateBuyerSubAccountMutation,
            CreateBuyerSubAccountMutationVariables,
            { buyerSubAccountsCreate: I_MutationResponse }
        >(this.createBuyerSubAccountGQL, variables, options);
    };

    updateBuyerSubAccount = (
        variables?: UpdateBuyerSubAccountMutationVariables,
        options?: I_GraphQLOptions<UpdateBuyerSubAccountMutation, { buyerSubAccountsUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateBuyerSubAccountMutation,
            UpdateBuyerSubAccountMutationVariables,
            { buyerSubAccountsUpdate: I_MutationResponse }
        >(this.updateBuyerSubAccountGQL, variables, options);
    };

    updateBuyerSubAccountsStatus = (
        variables?: UpdateBuyerSubAccountsStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateBuyerSubAccountsStatusMutation,
            { buyerSubAccountsStatusUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateBuyerSubAccountsStatusMutation,
            UpdateBuyerSubAccountsStatusMutationVariables,
            { buyerSubAccountsStatusUpdate: I_MutationResponse }
        >(this.updateBuyerSubAccountsStatusGQL, variables, options);
    };
    // #endregion

    // #region SUPPLIER MAIN ACCOUNT
    private normalizeSupplierList = (data: GetSuppliersQuery, extra?: I_NormalizeExtra): I_TableState<I_Supplier> => {
        return normalizeWithPagination<I_Supplier>(data.suppliers, extra);
    };

    getSupplier = (variables?: GetSupplierQueryVariables) => {
        return this.graphqlService.query<GetSupplierQuery, GetSupplierQueryVariables, I_Supplier>(
            this.getSupplierGQL,
            variables,
            {
                normalize: (data) => data.supplier,
            },
        ) as Promise<I_Supplier>;
    };

    getSuppliers = (
        variables?: GetSuppliersQueryVariables,
        options?: I_GraphQLOptions<GetSuppliersQuery, I_TableState<I_Supplier>>,
        extra?: I_NormalizeExtra,
    ) => {
        return this.graphqlService.query<GetSuppliersQuery, GetSuppliersQueryVariables, I_TableState<I_Supplier>>(
            this.getSuppliersGQL,
            variables,
            {
                normalize: (data) => this.normalizeSupplierList(data, extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Supplier>>;
    };

    updateSupplierDetail = (
        variables?: UpdateSupplierDetailMutationVariables,
        options?: I_GraphQLOptions<UpdateSupplierDetailMutation, { supplierDetailUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateSupplierDetailMutation,
            UpdateSupplierDetailMutationVariables,
            { supplierDetailUpdate: I_MutationResponse }
        >(this.updateSupplierDetailGQL, variables, options);
    };

    getSuppliersWithProducts = (
        variables?: GetSuppliersWithProductsQueryVariables,
        options?: I_GraphQLOptions<GetSuppliersWithProductsQuery, I_TableState<I_Supplier>>,
        extra?: I_NormalizeExtra,
    ) => {
        return this.graphqlService.query<
            GetSuppliersWithProductsQuery,
            GetSuppliersWithProductsQueryVariables,
            I_TableState<I_Supplier>
        >(this.getSuppliersWithProductsGQL, variables, {
            normalize: (data) => this.normalizeSupplierList(data, extra),
            ...options,
        }) as Promise<I_TableState<I_Supplier>>;
    };

    updateSupplierStatus = (
        variables?: UpdateSupplierStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateSupplierStatusMutation, { supplierStatusUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateSupplierStatusMutation,
            UpdateSupplierStatusMutationVariables,
            { supplierStatusUpdate: I_MutationResponse }
        >(this.updateSupplierStatusGQL, variables, options);
    };

    getSupplierProfile = (
        variables?: GetSupplierProfileQueryVariables,
        options?: I_GraphQLOptions<GetSupplierProfileQuery, I_SupplierProfile>,
    ) => {
        return this.graphqlService.query<GetSupplierProfileQuery, GetSupplierProfileQueryVariables, I_SupplierProfile>(
            this.getSupplierProfileGQL,
            variables,
            {
                ...options,
            },
        ) as Promise<I_SupplierProfile>;
    };
    // #endregion

    // #region BUYER SUB ACCOUNT
    private normalizeSupplierSubAccountsList = (
        data: GetSupplierSubAccountsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_SupplierSubAccount> => {
        return normalizeWithPagination<I_SupplierSubAccount>(data.supplierSubAccounts, extra);
    };

    getSupplierSubAccount = (
        variables?: GetSupplierSubAccountQueryVariables,
        options?: I_GraphQLOptions<GetSupplierSubAccountQuery, I_SupplierSubAccount>,
    ) => {
        return this.graphqlService.query<
            GetSupplierSubAccountQuery,
            GetSupplierSubAccountQueryVariables,
            I_SupplierSubAccount
        >(this.getSupplierSubAccountGQL, variables, {
            normalize: (data) => data.supplierSubAccount,
            ...options,
        }) as Promise<I_SupplierSubAccount>;
    };

    getSupplierSubAccountWithSupplier = (
        variables?: GetSupplierSubAccountWithSupplierQueryVariables,
        options?: I_GraphQLOptions<GetSupplierSubAccountWithSupplierQuery, I_SupplierSubAccount>,
    ) => {
        return this.graphqlService.query<
            GetSupplierSubAccountWithSupplierQuery,
            GetSupplierSubAccountWithSupplierQueryVariables,
            I_SupplierSubAccount
        >(this.getSupplierSubAccountWithSupplierGQL, variables, {
            normalize: (data) => data.supplierSubAccount,
            ...options,
        }) as Promise<I_SupplierSubAccount>;
    };

    getSupplierSubAccounts = (
        variables?: GetSupplierSubAccountsQueryVariables,
        options?: I_GraphQLOptions<GetSupplierSubAccountsQuery, I_TableState<I_SupplierSubAccount>>,
    ) => {
        return this.graphqlService.query<
            GetSupplierSubAccountsQuery,
            GetSupplierSubAccountsQueryVariables,
            I_TableState<I_SupplierSubAccount>
        >(this.getSupplierSubAccountsGQL, variables, {
            normalize: (data) => this.normalizeSupplierSubAccountsList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_SupplierSubAccount>>;
    };

    getSupplierSubAccountsWithSupplier = (
        variables?: GetSupplierSubAccountsWithSupplierQueryVariables,
        options?: I_GraphQLOptions<GetSupplierSubAccountsWithSupplierQuery, I_TableState<I_SupplierSubAccount>>,
    ) => {
        return this.graphqlService.query<
            GetSupplierSubAccountsWithSupplierQuery,
            GetSupplierSubAccountsWithSupplierQueryVariables,
            I_TableState<I_SupplierSubAccount>
        >(this.getSupplierSubAccountsWithSupplierGQL, variables, {
            normalize: (data) => this.normalizeSupplierSubAccountsList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_SupplierSubAccount>>;
    };
    getCoreBusinessCount = (
        variables?: GetCoreBusinessCountQueryVariables,
        options?: I_GraphQLOptions<GetCoreBusinessCountQuery, number>,
    ) => {
        return this.graphqlService.query<GetCoreBusinessCountQuery, GetCoreBusinessCountQueryVariables, number>(
            this.getCoreBusinessCountGQL,
            variables,
            {
                normalize: (data) => {
                    if (data?.profile?.__typename === 'SupplierNode') {
                        return data.profile.suppliercategorySet?.totalCount ?? 0;
                    }
                    return 0;
                },
                ...options,
            },
        ) as Promise<number>;
    };

    createSupplierSubAccount = (
        variables?: CreateSupplierSubAccountMutationVariables,
        options?: I_GraphQLOptions<CreateSupplierSubAccountMutation, { supplierSubAccountsCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateSupplierSubAccountMutation,
            CreateSupplierSubAccountMutationVariables,
            { supplierSubAccountsCreate: I_MutationResponse }
        >(this.createSupplierSubAccountGQL, variables, options);
    };

    updateSupplierSubAccount = (
        variables?: UpdateSupplierSubAccountMutationVariables,
        options?: I_GraphQLOptions<UpdateSupplierSubAccountMutation, { supplierSubAccountsUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateSupplierSubAccountMutation,
            UpdateSupplierSubAccountMutationVariables,
            { supplierSubAccountsUpdate: I_MutationResponse }
        >(this.updateSupplierSubAccountGQL, variables, options);
    };

    updateSupplierSubAccountsStatus = (
        variables?: UpdateSupplierSubAccountsStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateSupplierSubAccountsStatusMutation,
            { supplierSubAccountsStatusUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateSupplierSubAccountsStatusMutation,
            UpdateSupplierSubAccountsStatusMutationVariables,
            { supplierSubAccountsStatusUpdate: I_MutationResponse }
        >(this.updateSupplierSubAccountsStatusGQL, variables, options);
    };
    // #endregion

    // #region ADMIN ACCOUNT
    private normalizeUserPermissionList = (
        data: GetUserPermissionsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_UserPermission> => {
        return normalizeWithPagination<I_UserPermission>(data.userPermissions, extra);
    };

    getUserPermissions = (
        variables?: GetUserPermissionsQueryVariables,
        options?: I_GraphQLOptions<GetUserPermissionsQuery, I_TableState<I_UserPermission>>,
        extra?: I_NormalizeExtra,
    ) => {
        return this.graphqlService.query<
            GetUserPermissionsQuery,
            GetUserPermissionsQueryVariables,
            I_TableState<I_UserPermission>
        >(this.getUserPermissionsGQL, variables, {
            normalize: (data) => this.normalizeUserPermissionList(data, extra),
            ...options,
        }) as Promise<I_TableState<I_UserPermission>>;
    };

    updateUserPermissionStatus = (
        variables?: UpdateUserPermissionStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateUserPermissionStatusMutation,
            { userPermissionStatusUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateUserPermissionStatusMutation,
            UpdateUserPermissionStatusMutationVariables,
            { userPermissionStatusUpdate: I_MutationResponse }
        >(this.updateUserPermissionStatusGQL, variables, options);
    };
    //#endregion

    // #region GROUP
    //#endregion

    // #region GROUP PERMISSION
    private normalizeGroupPermissionList = (
        data: GetGroupPermissionsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_GroupPermission> => {
        return normalizeWithPagination<I_GroupPermission>(data.groupPermissions, extra);
    };

    getGroupPermissions = (
        variables?: GetGroupPermissionsQueryVariables,
        options?: I_GraphQLOptions<GetGroupPermissionsQuery, I_TableState<I_GroupPermission>>,
        extra?: I_NormalizeExtra,
    ) => {
        return this.graphqlService.query<
            GetGroupPermissionsQuery,
            GetGroupPermissionsQueryVariables,
            I_TableState<I_GroupPermission>
        >(this.getGroupPermissionsGQL, variables, {
            normalize: (data) => this.normalizeGroupPermissionList(data, extra),
            ...options,
        }) as Promise<I_TableState<I_GroupPermission>>;
    };
    // #endregion

    // #region ADMIN
    private normalizeAdminList = (data: GetAdminsQuery, extra?: I_NormalizeExtra): I_TableState<I_Admin> => {
        return normalizeWithPagination<I_Admin>(data.admins, extra);
    };

    getAdmin = (variables?: GetAdminQueryVariables, options?: I_GraphQLOptions<GetAdminQuery, I_Admin>) => {
        return this.graphqlService.query<GetAdminQuery, GetAdminQueryVariables, I_Admin>(this.getAdminGQL, variables, {
            normalize: (data) => ({
                ...data.admin,
                role: data.admin.role as unknown as E_Role,
            }),
            ...options,
        }) as Promise<I_Admin>;
    };

    getAdmins = (
        variables?: GetAdminsQueryVariables,
        options?: I_GraphQLOptions<GetAdminsQuery, I_TableState<I_Admin>>,
        extra?: I_NormalizeExtra,
    ) => {
        return this.graphqlService.query<GetAdminsQuery, GetAdminsQueryVariables, I_TableState<I_Admin>>(
            this.getAdminsGQL,
            variables,
            {
                normalize: (data) => this.normalizeAdminList(data, extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Admin>>;
    };

    createAdmin = (
        variables?: CreateAdminMutationVariables,
        options?: I_GraphQLOptions<CreateAdminMutation, { adminCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateAdminMutation,
            CreateAdminMutationVariables,
            { adminCreate: I_MutationResponse }
        >(this.createAdminGQL, variables, options);
    };
    createBuyer = (
        variables?: CreateBuyerMutationVariables,
        options?: I_GraphQLOptions<CreateBuyerMutation, { buyerCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateBuyerMutation,
            CreateBuyerMutationVariables,
            { buyerCreate: I_MutationResponse }
        >(this.createBuyerGQL, variables, options);
    };
    updateAdmin = (
        variables?: UpdateAdminMutationVariables,
        options?: I_GraphQLOptions<UpdateAdminMutation, { adminUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateAdminMutation,
            UpdateAdminMutationVariables,
            { adminUpdate: I_MutationResponse }
        >(this.updateAdminGQL, variables, options);
    };

    updateAdminStatus = (
        variables?: UpdateAdminStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateAdminStatusMutation, { adminStatusUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateAdminStatusMutation,
            UpdateAdminStatusMutationVariables,
            { adminStatusUpdate: I_MutationResponse }
        >(this.updateAdminStatusGQL, variables, options);
    };
    // #endregion

    // #region CLIENT FOCUS
    private normalizeClientFocusList = (
        data: GetClientFocusesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_ClientFocus> => {
        return normalizeWithPagination<I_ClientFocus>(data.clientFocuses, extra);
    };

    getClientFocuses = (
        variables?: GetClientFocusesQueryVariables,
        options?: I_GraphQLOptions<GetClientFocusesQuery, I_TableState<I_ClientFocus>>,
        extra?: I_NormalizeExtra,
    ) => {
        return this.graphqlService.query<
            GetClientFocusesQuery,
            GetClientFocusesQueryVariables,
            I_TableState<I_ClientFocus>
        >(this.getclientFocusesGQL, variables, {
            normalize: (data) => this.normalizeClientFocusList(data, extra),
            ...options,
        }) as Promise<I_TableState<I_ClientFocus>>;
    };
    // #endregion
}
