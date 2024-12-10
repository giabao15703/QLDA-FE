import {
    CreateNotificationGQL,
    CreateNotificationMutation,
    CreateNotificationMutationVariables,
    GetNotificationGQL,
    GetNotificationQuery,
    GetNotificationQueryVariables,
    GetNotificationsGQL,
    GetNotificationsQuery,
    GetNotificationsQueryVariables,
    UpdateNotificationGQL,
    UpdateNotificationMutation,
    UpdateNotificationMutationVariables,
} from '#shared/graphql/types';
import {
    I_DeTai,
    I_GraphQLOptions,
    I_KeHoach,
    I_MutationResponse,
    I_NormalizeExtra,
    I_Notification,
    I_TableState,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationQLDAService {
    constructor(
        private graphqlService: GraphqlService,
        private getNotificationsGQL: GetNotificationsGQL,
        private getNotificationGQL: GetNotificationGQL,
        private createNotificationGQL: CreateNotificationGQL,
        private updateNotificationGQL: UpdateNotificationGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeNotificationList = (
        data: GetNotificationsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_Notification> => {
        return normalizeWithPagination<I_Notification>(data.notifications, extra);
    };

    // Lấy danh sách Đề Tài
    getNotifications = (
        variables?: GetNotificationsQueryVariables,
        options?: I_GraphQLOptions<GetNotificationsQuery, I_TableState<I_Notification>>,
    ) => {
        return this.graphqlService.query<
            GetNotificationsQuery,
            GetNotificationsQueryVariables,
            I_TableState<I_Notification>
        >(this.getNotificationsGQL, variables, {
            normalize: (data) => this.normalizeNotificationList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_Notification>>;
    };

    // Lấy chi tiết một Đề Tài
    getNotification = (
        variables?: GetNotificationQueryVariables,
        options?: I_GraphQLOptions<GetNotificationQuery, I_Notification>,
    ) => {
        return this.graphqlService.query<GetNotificationQuery, GetNotificationQueryVariables, I_Notification>(
            this.getNotificationGQL,
            variables,
            {
                normalize: (data) => data.notification,
                ...options,
            },
        ) as Promise<I_Notification>;
    };

    // Tạo mới một Đề Tài
    createNotification = (
        variables?: CreateNotificationMutationVariables,
        options?: I_GraphQLOptions<CreateNotificationMutation, { createNotification: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateNotificationMutation,
            CreateNotificationMutationVariables,
            { createNotification: I_MutationResponse }
        >(this.createNotificationGQL, variables, options);
    };

    // Cập nhật một Đề Tài
    updateNotification = (
        variables?: UpdateNotificationMutationVariables,
        options?: I_GraphQLOptions<UpdateNotificationMutation, { updateNotification: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateNotificationMutation,
            UpdateNotificationMutationVariables,
            { updateNotification: I_MutationResponse }
        >(this.updateNotificationGQL, variables, options);
    };
}
