import {
    CreateDeTaiGQL,
    CreateDeTaiMutation,
    CreateDeTaiMutationVariables,
    GetDeTaiGQL,
    GetDeTaiQuery,
    GetDeTaiQueryVariables,
    GetDeTaisGQL,
    GetDeTaisQuery,
    GetDeTaisQueryVariables,
} from '#shared/graphql/types';
import { I_DeTai, I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class DeTaiService {
    constructor(
        private graphqlService: GraphqlService,
        private getDeTaisGQL: GetDeTaisGQL, // Hàm lấy danh sách DeTai
        private getDeTaiGQL: GetDeTaiGQL, // Hàm lấy chi tiết DeTai
        private createDeTaiGQL: CreateDeTaiGQL, // Hàm tạo DeTai
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeDeTaiList = (data: GetDeTaisQuery, extra?: I_NormalizeExtra): I_TableState<I_DeTai> => {
        return normalizeWithPagination<I_DeTai>(data.deTais, extra);
    };

    // Lấy danh sách Đề Tài
    getDeTais = (
        variables?: GetDeTaisQueryVariables,
        options?: I_GraphQLOptions<GetDeTaisQuery, I_TableState<I_DeTai>>,
    ) => {
        return this.graphqlService.query<GetDeTaisQuery, GetDeTaisQueryVariables, I_TableState<I_DeTai>>(
            this.getDeTaisGQL,
            variables,
            {
                normalize: (data) => this.normalizeDeTaiList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_DeTai>>;
    };

    // Lấy chi tiết một Đề Tài
    getDeTai = (variables?: GetDeTaiQueryVariables, options?: I_GraphQLOptions<GetDeTaiQuery, I_DeTai>) => {
        return this.graphqlService.query<GetDeTaiQuery, GetDeTaiQueryVariables, I_DeTai>(this.getDeTaiGQL, variables, {
            normalize: (data) => data.deTai,
            ...options,
        }) as Promise<I_DeTai>;
    };

    // Tạo mới một Đề Tài
    createDeTai = (
        variables?: CreateDeTaiMutationVariables,
        options?: I_GraphQLOptions<CreateDeTaiMutation, { deTaiCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateDeTaiMutation,
            CreateDeTaiMutationVariables,
            { deTaiCreate: I_MutationResponse }
        >(this.createDeTaiGQL, variables, options);
    };
}
