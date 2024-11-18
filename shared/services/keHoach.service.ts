import {
    CreateDeTaiGQL,
    CreateDeTaiMutation,
    CreateDeTaiMutationVariables,
    CreateKeHoachGQL,
    CreateKeHoachMutation,
    CreateKeHoachMutationVariables,
    GetDeTaiGQL,
    GetDeTaiQuery,
    GetDeTaiQueryVariables,
    GetDeTaisGQL,
    GetDeTaisQuery,
    GetDeTaisQueryVariables,
    GetKeHoachGQL,
    GetKeHoachQuery,
    GetKeHoachQueryVariables,
    GetKeHoachsGQL,
    GetKeHoachsQuery,
    GetKeHoachsQueryVariables,
    UpdateKeHoachGQL,
    UpdateKeHoachMutation,
    UpdateKeHoachMutationVariables,
} from '#shared/graphql/types';
import {
    I_DeTai,
    I_GraphQLOptions,
    I_KeHoach,
    I_MutationResponse,
    I_NormalizeExtra,
    I_TableState,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class KeHoachService {
    constructor(
        private graphqlService: GraphqlService,
        private getDeTaisGQL: GetDeTaisGQL, // Hàm lấy danh sách DeTai
        private getDeTaiGQL: GetDeTaiGQL, // Hàm lấy chi tiết DeTai
        private createDeTaiGQL: CreateDeTaiGQL,
        private getKeHoachsGQL: GetKeHoachsGQL,
        private getKeHoachGQL: GetKeHoachGQL,
        private createKeHoachGQL: CreateKeHoachGQL,
        private updateKeHoachGQL: UpdateKeHoachGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeKeHoachList = (data: GetKeHoachsQuery, extra?: I_NormalizeExtra): I_TableState<I_KeHoach> => {
        return normalizeWithPagination<I_KeHoach>(data.keHoachDoAns, extra);
    };

    // Lấy danh sách Đề Tài
    getKeHoachs = (
        variables?: GetKeHoachsQueryVariables,
        options?: I_GraphQLOptions<GetKeHoachsQuery, I_TableState<I_KeHoach>>,
    ) => {
        return this.graphqlService.query<GetKeHoachsQuery, GetKeHoachsQueryVariables, I_TableState<I_KeHoach>>(
            this.getKeHoachsGQL,
            variables,
            {
                normalize: (data) => this.normalizeKeHoachList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_KeHoach>>;
    };

    // Lấy chi tiết một Đề Tài
    getKeHoach = (variables?: GetKeHoachQueryVariables, options?: I_GraphQLOptions<GetKeHoachQuery, I_KeHoach>) => {
        return this.graphqlService.query<GetKeHoachQuery, GetKeHoachQueryVariables, I_KeHoach>(
            this.getKeHoachGQL,
            variables,
            {
                normalize: (data) => data.keHoachDoAn,
                ...options,
            },
        ) as Promise<I_KeHoach>;
    };

    // Tạo mới một Đề Tài
    createKeHoach = (
        variables?: CreateKeHoachMutationVariables,
        options?: I_GraphQLOptions<CreateKeHoachMutation, { createKeHoachDoAn: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateKeHoachMutation,
            CreateKeHoachMutationVariables,
            { createKeHoachDoAn: I_MutationResponse }
        >(this.createKeHoachGQL, variables, options);
    };

    // Cập nhật một Đề Tài
    updateKeHoach = (
        variables?: UpdateKeHoachMutationVariables,
        options?: I_GraphQLOptions<UpdateKeHoachMutation, { updateKeHoachDoAn: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateKeHoachMutation,
            UpdateKeHoachMutationVariables,
            { updateKeHoachDoAn: I_MutationResponse }
        >(this.updateKeHoachGQL, variables, options);
    };

    
}
