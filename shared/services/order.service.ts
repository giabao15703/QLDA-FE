import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateGiangVienGQL,
    CreateGiangVienMutation,
    CreateGiangVienMutationVariables,
    CreateGroupStudentGQL,
    CreateGroupStudentMutation,
    CreateGroupStudentMutationVariables,
    CreateOrderGQL,
    CreateOrderMutation,
    CreateOrderMutationVariables,
    GetGiangVienGQL,
    GetGiangVienQuery,
    GetGiangVienQueryVariables,
    GetGiangViensGQL,
    GetGiangViensQuery,
    GetGiangViensQueryVariables,
    GetGroupStudentGQL,
    GetGroupStudentQuery,
    GetGroupStudentQueryVariables,
    GetGroupStudentsGQL,
    GetGroupStudentsQuery,
    GetGroupStudentsQueryVariables,
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
    I_GiangVien,
    I_GraphQLOptions,
    I_GroupStudent,
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
        private getGiangViensGQL: GetGiangViensGQL,
        private getGiangVienGQL: GetGiangVienGQL,
        private createGiangVienGQL: CreateGiangVienGQL,
        private getGroupStudentsGQL: GetGroupStudentsGQL,
        private getGroupStudentGQL: GetGroupStudentGQL,
        private createGroupStudentGQL: CreateGroupStudentGQL,
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

    private normalizeGiangVien = (data: GetGiangViensQuery, extra?: any): I_TableState<I_GiangVien> => {
        return normalizeWithPagination<I_GiangVien>(data.giangViens, extra);
    };

    getGiangViens = (
        variables?: GetGiangViensQueryVariables,
        options?: I_GraphQLOptions<GetGiangViensQuery, I_TableState<I_GiangVien>>,
    ) => {
        return this.graphqlService.query<GetGiangViensQuery, GetGiangViensQueryVariables, I_TableState<I_GiangVien>>(
            this.getGiangViensGQL,
            variables,
            {
                normalize: (data) => this.normalizeGiangVien(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_GiangVien>>;
    };

    getGiangVien = (
        variables?: GetGiangVienQueryVariables,
        options?: I_GraphQLOptions<GetGiangVienQuery, I_GiangVien>,
    ) => {
        return this.graphqlService.query<GetGiangVienQuery, GetGiangVienQueryVariables, I_GiangVien>(
            this.getGiangVienGQL,
            variables,
            options,
        );
    };

    createGiangVien = (
        variables?: CreateGiangVienMutationVariables,
        options?: I_GraphQLOptions<CreateGiangVienMutation, { createGiangVien: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateGiangVienMutation,
            CreateGiangVienMutationVariables,
            { createGiangVien: I_MutationResponse }
        >(this.createGiangVienGQL, variables, options);
    };

    private normalizeGroupStudent = (data: GetGroupStudentsQuery, extra?: any): I_TableState<I_GroupStudent> => {
        return normalizeWithPagination<I_GroupStudent>(data.groups, extra);
    };

    getGroupStudents = (
        variables?: GetGroupStudentsQueryVariables,
        options?: I_GraphQLOptions<GetGroupStudentsQuery, I_TableState<I_GroupStudent>>,
    ) => {
        return this.graphqlService.query<
            GetGroupStudentsQuery,
            GetGroupStudentsQueryVariables,
            I_TableState<I_GroupStudent>
        >(this.getGroupStudentsGQL, variables, {
            normalize: (data) => this.normalizeGroupStudent(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_GroupStudent>>;
    };

    getGroupStudent = (
        variables?: GetGroupStudentQueryVariables,
        options?: I_GraphQLOptions<GetGroupStudentQuery, I_GroupStudent>,
    ) => {
        return this.graphqlService.query<GetGroupStudentQuery, GetGroupStudentQueryVariables, I_GroupStudent>(
            this.getGroupStudentGQL,
            variables,
            options,
        );
    };

    createGroupStudent = (
        variables?: CreateGroupStudentMutationVariables,
        options?: I_GraphQLOptions<CreateGroupStudentMutation, { createGroupStudent: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateGroupStudentMutation,
            CreateGroupStudentMutationVariables,
            { createGroupStudent: I_MutationResponse }
        >(this.createGroupStudentGQL, variables, options);
    };
}
