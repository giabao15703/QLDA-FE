import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateDeliveryResponsibleGQL,
    CreateDeliveryResponsibleMutation,
    CreateDeliveryResponsibleMutationVariables,
    CreateShippingFeeGQL,
    CreateShippingFeeMutation,
    CreateShippingFeeMutationVariables,
    CreateTransporterListGQL,
    CreateTransporterListMutation,
    CreateTransporterListMutationVariables,
    GetDeliveryResponsibleGQL,
    GetDeliveryResponsibleQuery,
    GetDeliveryResponsibleQueryVariables,
    GetDeliveryResponsiblesGQL,
    GetDeliveryResponsiblesQuery,
    GetDeliveryResponsiblesQueryVariables,
    GetShippingFeeGQL,
    GetShippingFeeQuery,
    GetShippingFeeQueryVariables,
    GetShippingFeesGQL,
    GetShippingFeesQuery,
    GetShippingFeesQueryVariables,
    GetTransporterListGQL,
    GetTransporterListQuery,
    GetTransporterListQueryVariables,
    GetTransporterListsGQL,
    GetTransporterListsQuery,
    GetTransporterListsQueryVariables,
    UpdateDeliveryResponsibleGQL,
    UpdateDeliveryResponsibleMutation,
    UpdateDeliveryResponsibleMutationVariables,
    UpdateShippingFeeGQL,
    UpdateShippingFeeMutation,
    UpdateShippingFeeMutationVariables,
    UpdateTransporterListGQL,
    UpdateTransporterListMutation,
    UpdateTransporterListMutationVariables,
} from '#shared/graphql/types';
import {
    I_DeliveryResponsible,
    I_GraphQLOptions,
    I_MutationResponse,
    I_NormalizeExtra,
    I_ShippingFee,
    I_TableState,
    I_Transporter,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class DeliveryService {
    constructor(
        private graphqlService: GraphqlService,
        private getTransporterListsGQL: GetTransporterListsGQL,
        private getTransporterListGQL: GetTransporterListGQL,
        private createTransporterListGQL: CreateTransporterListGQL,
        private updateTransporterListGQL: UpdateTransporterListGQL,
        private getDeliveryResponsiblesGQL: GetDeliveryResponsiblesGQL,
        private getDeliveryResponsibleGQL: GetDeliveryResponsibleGQL,
        private createDeliveryResponsibleGQL: CreateDeliveryResponsibleGQL,
        private updateDeliveryResponsibleGQL: UpdateDeliveryResponsibleGQL,
        private getShippingFeeGQL: GetShippingFeeGQL,
        private getShippingFeesGQL: GetShippingFeesGQL,
        private createShippingFeeGQL: CreateShippingFeeGQL,
        private updateShippingFeeGQL: UpdateShippingFeeGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeTransporter = (
        data: GetTransporterListsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_Transporter> => {
        return normalizeWithPagination<I_Transporter>(data.transporterLists, extra);
    };

    getTransporters = (
        variables?: GetTransporterListsQueryVariables,
        options?: I_GraphQLOptions<GetTransporterListsQuery, I_TableState<I_Transporter>>,
    ) => {
        return this.graphqlService.query<
            GetTransporterListsQuery,
            GetTransporterListsQueryVariables,
            I_TableState<I_Transporter>
        >(this.getTransporterListsGQL, variables, {
            normalize: (data) => this.normalizeTransporter(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_Transporter>>;
    };

    getTransporter = (
        variables?: GetTransporterListQueryVariables,
        options?: I_GraphQLOptions<GetTransporterListQuery, I_Transporter>,
    ) => {
        return this.graphqlService.query<GetTransporterListQuery, GetTransporterListQueryVariables, I_Transporter>(
            this.getTransporterListGQL,
            variables,
            {
                normalize: (data) => data.transporterList,
                ...options,
            },
        ) as Promise<I_Transporter>;
    };

    createTransporter = (
        variables?: CreateTransporterListMutationVariables,
        options?: I_GraphQLOptions<CreateTransporterListMutation, { transporterListCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateTransporterListMutation,
            CreateTransporterListMutationVariables,
            { transporterListCreate: I_MutationResponse }
        >(this.createTransporterListGQL, variables, options);
    };

    updateTransporter = (
        variables?: UpdateTransporterListMutationVariables,
        options?: I_GraphQLOptions<UpdateTransporterListMutation, { transporterListUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateTransporterListMutation,
            UpdateTransporterListMutationVariables,
            { transporterListUpdate: I_MutationResponse }
        >(this.updateTransporterListGQL, variables, options);
    };

    private normalizeDeliveryResponsible = (
        data: GetDeliveryResponsiblesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_DeliveryResponsible> => {
        return normalizeWithPagination<I_DeliveryResponsible>(data.deliveryResponsibles, extra);
    };

    getDeliveryResponsibles = (
        variables?: GetDeliveryResponsiblesQueryVariables,
        options?: I_GraphQLOptions<GetDeliveryResponsiblesQuery, I_TableState<I_DeliveryResponsible>>,
    ) => {
        return this.graphqlService.query<
            GetDeliveryResponsiblesQuery,
            GetDeliveryResponsiblesQueryVariables,
            I_TableState<I_DeliveryResponsible>
        >(this.getDeliveryResponsiblesGQL, variables, {
            normalize: (data) => this.normalizeDeliveryResponsible(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_DeliveryResponsible>>;
    };
    getDeliveryResponsible = (
        variables?: GetDeliveryResponsibleQueryVariables,
        options?: I_GraphQLOptions<GetDeliveryResponsibleQuery, I_DeliveryResponsible>,
    ) => {
        return this.graphqlService.query<
            GetDeliveryResponsibleQuery,
            GetDeliveryResponsibleQueryVariables,
            I_DeliveryResponsible
        >(this.getDeliveryResponsibleGQL, variables, {
            normalize: (data) => data.deliveryResponsible,
            ...options,
        }) as Promise<I_DeliveryResponsible>;
    };

    createDeliveryResponsible = (
        variables?: CreateDeliveryResponsibleMutationVariables,
        options?: I_GraphQLOptions<
            CreateDeliveryResponsibleMutation,
            { deliveryResponsibleCreate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            CreateDeliveryResponsibleMutation,
            CreateDeliveryResponsibleMutationVariables,
            { deliveryResponsibleCreate: I_MutationResponse }
        >(this.createDeliveryResponsibleGQL, variables, options);
    };

    updateDeliveryResponsible = (
        variables?: UpdateDeliveryResponsibleMutationVariables,
        options?: I_GraphQLOptions<
            UpdateDeliveryResponsibleMutation,
            { deliveryResponsibleUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateDeliveryResponsibleMutation,
            UpdateDeliveryResponsibleMutationVariables,
            { deliveryResponsibleUpdate: I_MutationResponse }
        >(this.updateDeliveryResponsibleGQL, variables, options);
    };

    private normalizeShippingFeeList = (
        data: GetShippingFeesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_ShippingFee> => {
        return normalizeWithPagination<I_ShippingFee>(data.shippingFees, extra);
    };

    getShippingFees = (
        variables?: GetShippingFeesQueryVariables,
        options?: I_GraphQLOptions<GetShippingFeesQuery, I_TableState<I_ShippingFee>>,
    ) => {
        return this.graphqlService.query<
            GetShippingFeesQuery,
            GetShippingFeesQueryVariables,
            I_TableState<I_ShippingFee>
        >(this.getShippingFeesGQL, variables, {
            normalize: (data) => this.normalizeShippingFeeList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_ShippingFee>>;
    };

    getShippingFee = (
        variables?: GetShippingFeeQueryVariables,
        options?: I_GraphQLOptions<GetShippingFeeQuery, I_ShippingFee>,
    ) => {
        return this.graphqlService.query<GetShippingFeeQuery, GetShippingFeeQueryVariables, I_ShippingFee>(
            this.getShippingFeeGQL,
            variables,
            {
                normalize: (data) => data.shippingFee,
                ...options,
            },
        ) as Promise<I_ShippingFee>;
    };

    createShippingFee = (
        variables?: CreateShippingFeeMutationVariables,
        options?: I_GraphQLOptions<CreateShippingFeeMutation, { shippingFeeCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateShippingFeeMutation,
            CreateShippingFeeMutationVariables,
            { shippingFeeCreate: I_MutationResponse }
        >(this.createShippingFeeGQL, variables, options);
    };

    updateShippingFee = (
        variables?: UpdateShippingFeeMutationVariables,
        options?: I_GraphQLOptions<UpdateShippingFeeMutation, { shippingFeeUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateShippingFeeMutation,
            UpdateShippingFeeMutationVariables,
            { shippingFeeUpdate: I_MutationResponse }
        >(this.updateShippingFeeGQL, variables, options);
    };
}
