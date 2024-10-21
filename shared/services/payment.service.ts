import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CheckPaymentPendingGQL,
    CheckPaymentPendingMutation,
    CheckPaymentPendingMutationVariables,
    CreateBankTransferGQL,
    CreateBankTransferMutation,
    CreateBankTransferMutationVariables,
    GetHistoryPaymentGQL,
    GetHistoryPaymentQuery,
    GetHistoryPaymentQueryVariables,
    GetHistoryPaymentsGQL,
    GetHistoryPaymentsQuery,
    GetHistoryPaymentsQueryVariables,
    GetHistoryPendingGQL,
    GetHistoryPendingQuery,
    GetHistoryPendingQueryVariables,
    GetUserPaymentsGQL,
    GetUserPaymentsQuery,
    GetUserPaymentsQueryVariables,
    UpdateHistoryStatusGQL,
    UpdateHistoryStatusMutation,
    UpdateHistoryStatusMutationVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { I_HistoryPayment, I_HistoryPending, I_UserPayment } from 'shared/types/payment';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class PaymentDataService {
    constructor(
        private graphqlService: GraphqlService,
        private getHistoryPaymentsGQL: GetHistoryPaymentsGQL,
        private getHistoryPaymentGQL: GetHistoryPaymentGQL,
        private getHistoryPendingGQL: GetHistoryPendingGQL,
        private updateHistoryStatusGQL: UpdateHistoryStatusGQL,
        private getUserPaymentsGQL: GetUserPaymentsGQL,
        private checkPaymentPendingGQL: CheckPaymentPendingGQL,
        private createBankTransferGQL: CreateBankTransferGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeHistoryPaymentList = (
        data: GetHistoryPaymentsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_HistoryPayment> => {
        return normalizeWithPagination<I_HistoryPayment>(data.historyPayments, extra);
    };
    private normalizeUserPaymentList = (
        data: GetUserPaymentsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_UserPayment> => {
        return normalizeWithPagination<I_UserPayment>(data.userPayments, extra);
    };
    getUserPayments = (
        variables?: GetUserPaymentsQueryVariables,
        options?: I_GraphQLOptions<GetUserPaymentsQuery, I_TableState<I_UserPayment>>,
    ) => {
        return this.graphqlService.query<
            GetUserPaymentsQuery,
            GetUserPaymentsQueryVariables,
            I_TableState<I_UserPayment>
        >(this.getUserPaymentsGQL, variables, {
            normalize: (data) => this.normalizeUserPaymentList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_UserPayment>>;
    };

    getHistoryPayment = (
        variables?: GetHistoryPaymentQueryVariables,
        options?: I_GraphQLOptions<GetHistoryPaymentQuery, I_HistoryPayment>,
    ) => {
        return this.graphqlService.query<GetHistoryPaymentQuery, GetHistoryPaymentQueryVariables, I_HistoryPayment>(
            this.getHistoryPaymentGQL,
            variables,
            {
                normalize: (data) => data.historyPayment,
                ...options,
            },
        ) as Promise<I_HistoryPayment>;
    };

    getHistoryPayments = (
        variables?: GetHistoryPaymentsQueryVariables,
        options?: I_GraphQLOptions<GetHistoryPaymentsQuery, I_TableState<I_HistoryPayment>>,
    ) => {
        return this.graphqlService.query<
            GetHistoryPaymentsQuery,
            GetHistoryPaymentsQueryVariables,
            I_TableState<I_HistoryPayment>
        >(this.getHistoryPaymentsGQL, variables, {
            normalize: (data) => this.normalizeHistoryPaymentList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_HistoryPayment>>;
    };

    getHistoryPending = (
        variables?: GetHistoryPendingQueryVariables,
        options?: I_GraphQLOptions<GetHistoryPendingQuery, I_HistoryPending>,
    ) => {
        return this.graphqlService.query<GetHistoryPendingQuery, GetHistoryPendingQueryVariables, I_HistoryPending>(
            this.getHistoryPendingGQL,
            variables,
            {
                normalize: (data) => data.historyPending,
                ...options,
            },
        ) as Promise<I_HistoryPending>;
    };

    updateHistoryStatus = (
        variables?: UpdateHistoryStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateHistoryStatusMutation, { historyUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateHistoryStatusMutation,
            UpdateHistoryStatusMutationVariables,
            { historyUpdateStatus: I_MutationResponse }
        >(this.updateHistoryStatusGQL, variables, options);
    };
    checkPaymentPending = (
        variables?: CheckPaymentPendingMutationVariables,
        options?: I_GraphQLOptions<CheckPaymentPendingMutation, { paymentPendingCheck: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CheckPaymentPendingMutation,
            CheckPaymentPendingMutationVariables,
            { paymentPendingCheck: I_MutationResponse }
        >(this.checkPaymentPendingGQL, variables, options);
    };
    createBankTransfer = (
        variables?: CreateBankTransferMutationVariables,
        options?: I_GraphQLOptions<CreateBankTransferMutation, { bankTransferCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateBankTransferMutation,
            CreateBankTransferMutationVariables,
            { bankTransferCreate: I_MutationResponse }
        >(this.createBankTransferGQL, variables, options);
    };
}
