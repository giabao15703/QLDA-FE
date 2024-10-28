import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateOrderGQL,
    CreateOrderMutation,
    CreateOrderMutationVariables,
    GetOrdersGQL,
    GetOrdersQuery,
    GetOrdersQueryVariables,
    UpdateOrderGQL,
    UpdateOrderMutation,
    UpdateOrderMutationVariables,
    UpdateOrderStatusGQL,
    UpdateOrderStatusMutation,
    UpdateOrderStatusMutationVariables,
} from '#shared/graphql/types';
import { GraphqlService } from '#shared/services';
import {
    E_OrderStatus,
    I_GraphQLOptions,
    I_MutationResponse,
    I_NormalizeExtra,
    I_Order,
    I_TableState,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    constructor(
        private graphqlService: GraphqlService,
        private getOrdersGQL: GetOrdersGQL,
        private createOrderGQL: CreateOrderGQL,
        private updateOrderGQL: UpdateOrderGQL,
        private updateOrderStatusGQL: UpdateOrderStatusGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeOrder = (data: GetOrdersQuery, extra?: I_NormalizeExtra): I_TableState<I_Order> => {
        return normalizeWithPagination<I_Order>(data.orders, extra);
    };

    getOrders = (
        variables?: GetOrdersQueryVariables,
        options?: I_GraphQLOptions<GetOrdersQuery, I_TableState<I_Order>>,
    ) => {
        return this.graphqlService.query<GetOrdersQuery, GetOrdersQueryVariables, I_TableState<I_Order>>(
            this.getOrdersGQL,
            variables,
            {
                normalize: (data) => this.normalizeOrder(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Order>>;
    };
    createOrder = (
        variables?: CreateOrderMutationVariables,
        options?: I_GraphQLOptions<CreateOrderMutation, { createOrder: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateOrderMutation,
            CreateOrderMutationVariables,
            { createOrder: I_MutationResponse }
        >(this.createOrderGQL, variables, options);
    };
    updateOrder = (
        variables?: UpdateOrderMutationVariables,
        id?: string,
        p0?: { orderStatus: E_OrderStatus },
        options?: I_GraphQLOptions<UpdateOrderMutation, { updateOrder: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateOrderMutation,
            UpdateOrderMutationVariables,
            { updateOrder: I_MutationResponse }
        >(this.updateOrderGQL, variables, options);
    };
    updateOrderStatus = (
        variables?: UpdateOrderStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateOrderStatusMutation, { updateOrderStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateOrderStatusMutation,
            UpdateOrderStatusMutationVariables,
            { updateOrderStatus: I_MutationResponse }
        >(this.updateOrderStatusGQL, variables, options);
    };
}
