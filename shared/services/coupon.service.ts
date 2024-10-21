import {
    CreateCouponGQL,
    CreateCouponMutation,
    CreateCouponMutationVariables,
    GetCouponGQL,
    GetCouponQuery,
    GetCouponQueryVariables,
    GetCouponsGQL,
    GetCouponsQuery,
    GetCouponsQueryVariables,
    UpdateCouponGQL,
    UpdateCouponMutation,
    UpdateCouponMutationVariables,
    UpdateCouponStatusGQL,
    UpdateCouponStatusMutation,
    UpdateCouponStatusMutationVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { I_Coupon } from 'shared/types/coupon';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class CouponDataService {
    constructor(
        private graphqlService: GraphqlService,
        private getCouponsGQL: GetCouponsGQL,
        private getCouponGQL: GetCouponGQL,
        private createCouponGQL: CreateCouponGQL,
        private updateCouponGQL: UpdateCouponGQL,
        private updateCouponStatusGQL: UpdateCouponStatusGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeCouponList = (data: GetCouponsQuery, extra?: I_NormalizeExtra): I_TableState<I_Coupon> => {
        return normalizeWithPagination<I_Coupon>(data.coupons, extra);
    };

    getCoupons = (
        variables?: GetCouponsQueryVariables,
        options?: I_GraphQLOptions<GetCouponsQuery, I_TableState<I_Coupon>>,
    ) => {
        return this.graphqlService.query<GetCouponsQuery, GetCouponsQueryVariables, I_TableState<I_Coupon>>(
            this.getCouponsGQL,
            variables,
            {
                normalize: (data) => this.normalizeCouponList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Coupon>>;
    };

    getCoupon = (variables?: GetCouponQueryVariables, options?: I_GraphQLOptions<GetCouponQuery, I_Coupon>) => {
        return this.graphqlService.query<GetCouponQuery, GetCouponQueryVariables, I_Coupon>(
            this.getCouponGQL,
            variables,
            {
                normalize: (data) => data.coupon,
                ...options,
            },
        ) as Promise<I_Coupon>;
    };

    createCoupon = (
        variables?: CreateCouponMutationVariables,
        options?: I_GraphQLOptions<CreateCouponMutation, { couponCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateCouponMutation,
            CreateCouponMutationVariables,
            { couponCreate: I_MutationResponse }
        >(this.createCouponGQL, variables, options);
    };

    updateCoupon = (
        variables?: UpdateCouponMutationVariables,
        options?: I_GraphQLOptions<UpdateCouponMutation, { couponUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCouponMutation,
            UpdateCouponMutationVariables,
            { couponUpdate: I_MutationResponse }
        >(this.updateCouponGQL, variables, options);
    };

    updateCouponStatus = (
        variables?: UpdateCouponStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateCouponStatusMutation, { couponUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCouponStatusMutation,
            UpdateCouponStatusMutationVariables,
            { couponUpdateStatus: I_MutationResponse }
        >(this.updateCouponStatusGQL, variables, options);
    };
}
