import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    GetSameCategoryProductListGQL,
    GetSameCategoryProductListQuery,
    GetSameCategoryProductListQueryVariables,
    GetSupplierProductGQL,
    GetSupplierProductListGQL,
    GetSupplierProductListQuery,
    GetSupplierProductListQueryVariables,
    GetSupplierProductListSimpleGQL,
    GetSupplierProductListSimpleQuery,
    GetSupplierProductListSimpleQueryVariables,
    GetSupplierProductQuery,
    GetSupplierProductQueryVariables,
    UpdateSupplierProductStatusGQL,
    UpdateSupplierProductStatusMutation,
    UpdateSupplierProductStatusMutationVariables,
    SupplierProductClickCountGQL,
    SupplierProductClickCountMutationVariables,
    SupplierProductClickCountMutation,
    SupplierProductClickCount,
} from '#shared/graphql/types';
import { GraphqlService } from '#shared/services';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_Product, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    constructor(
        private graphqlService: GraphqlService,
        private getSupplierProductListGQL: GetSupplierProductListGQL,
        private getSupplierProductListSimpleGQL: GetSupplierProductListSimpleGQL,
        private updateProductStatusGQL: UpdateSupplierProductStatusGQL,
        private getSupplierProductGQL: GetSupplierProductGQL,
        private getSameCategoryProductListGQL: GetSameCategoryProductListGQL,
        private supplierProductClickCountGQL: SupplierProductClickCountGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeSupplierProductList = (
        data: GetSupplierProductListQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_Product> => {
        return normalizeWithPagination<I_Product>(data.supplierProductList, extra);
    };

    getSupplierProductList = (
        variables?: GetSupplierProductListQueryVariables,
        options?: I_GraphQLOptions<GetSupplierProductListQuery, I_TableState<I_Product>>,
    ) => {
        return this.graphqlService.query<
            GetSupplierProductListQuery,
            GetSupplierProductListQueryVariables,
            I_TableState<I_Product>
        >(this.getSupplierProductListGQL, variables, {
            normalize: (data) => this.normalizeSupplierProductList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_Product>>;
    };

    private normalizeSupplierProductListSimple = (
        data: GetSupplierProductListSimpleQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_Product> => {
        return normalizeWithPagination<I_Product>(data.supplierProductList, extra);
    };

    getSupplierProductListSimple = (
        variables?: GetSupplierProductListSimpleQueryVariables,
        options?: I_GraphQLOptions<GetSupplierProductListSimpleQuery, I_TableState<I_Product>>,
    ) => {
        return this.graphqlService.query<
            GetSupplierProductListSimpleQuery,
            GetSupplierProductListSimpleQueryVariables,
            I_TableState<I_Product>
        >(this.getSupplierProductListSimpleGQL, variables, {
            normalize: (data) => this.normalizeSupplierProductListSimple(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_Product>>;
    };

    updateSupplierProductStatus = (
        variables?: UpdateSupplierProductStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateSupplierProductStatusMutation,
            { supplierProductConfirmedStatusUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateSupplierProductStatusMutation,
            UpdateSupplierProductStatusMutationVariables,
            { supplierProductConfirmedStatusUpdate: I_MutationResponse }
        >(this.updateProductStatusGQL, variables, options);
    };

    getSupplierProduct = (
        variables?: GetSupplierProductQueryVariables,
        options?: I_GraphQLOptions<GetSupplierProductQuery, I_Product>,
    ) => {
        return this.graphqlService.query<GetSupplierProductQuery, GetSupplierProductQueryVariables, I_Product>(
            this.getSupplierProductGQL,
            variables,
            {
                normalize: (data) => data.supplierProduct as unknown as I_Product,
                ...options,
            },
        ) as Promise<I_Product>;
    };

    private normalizeSameCategoryProductList = (
        data: GetSameCategoryProductListQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_Product> => {
        return normalizeWithPagination<I_Product>(data.supplierProductSameCategoryList, extra);
    };

    getSameCategoryProducts = (
        variables?: GetSameCategoryProductListQueryVariables,
        options?: I_GraphQLOptions<GetSameCategoryProductListQuery, I_TableState<I_Product>>,
    ) => {
        return this.graphqlService.query<
            GetSameCategoryProductListQuery,
            GetSameCategoryProductListQueryVariables,
            I_TableState<I_Product>
        >(this.getSameCategoryProductListGQL, variables, {
            normalize: (data) => this.normalizeSameCategoryProductList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_Product>>;
    };
    productClickCount = (variables?: SupplierProductClickCountMutationVariables) => {
        return this.graphqlService.mutate<
            SupplierProductClickCountMutation,
            SupplierProductClickCountMutationVariables,
            { supplierProductConfirmedStatusUpdate: I_MutationResponse }
        >(this.supplierProductClickCountGQL, variables) as SupplierProductClickCount;
    };
}
