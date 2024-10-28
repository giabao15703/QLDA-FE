import {
    CreateGroupQldaGQL,
    CreateGroupQldaMutation,
    CreateGroupQldaMutationVariables,
    GetGroupQldaGQL,
    GetGroupQldaQuery,
    GetGroupQldaQueryVariables,
    GetGroupQldasGQL,
    GetGroupQldasQuery,
    GetGroupQldasQueryVariables,
    GetGroupQldaJoinGQL, // <-- Import thêm mutation này
    GetGroupQldaJoinMutation,
    GetGroupQldaJoinMutationVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphqlService } from './core/graphql.service';
import { I_GroupQLDA } from 'shared/types/group';

@Injectable({
    providedIn: 'root',
})
export class GroupQLDAService {
    constructor(
        private graphqlService: GraphqlService,
        private getGroupQldasGQL: GetGroupQldasGQL, // Lấy danh sách GroupQLDA
        private getGroupQldaGQL: GetGroupQldaGQL, // Lấy chi tiết GroupQLDA
        private createGroupQldaGQL: CreateGroupQldaGQL, // Tạo GroupQLDA
        private getGroupQldaJoinGQL: GetGroupQldaJoinGQL, // <-- Thêm mutation để join GroupQLDA
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeGroupQldaList = (
        data: GetGroupQldasQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_GroupQLDA> => {
        return normalizeWithPagination<I_GroupQLDA>(data.groupQldas, extra);
    };

    // Lấy danh sách GroupQLDA
    getGroupQldas = (
        variables?: GetGroupQldasQueryVariables,
        options?: I_GraphQLOptions<GetGroupQldasQuery, I_TableState<I_GroupQLDA>>,
    ) => {
        return this.graphqlService.query<GetGroupQldasQuery, GetGroupQldasQueryVariables, I_TableState<I_GroupQLDA>>(
            this.getGroupQldasGQL,
            variables,
            {
                normalize: (data) => this.normalizeGroupQldaList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_GroupQLDA>>;
    };

    // Lấy chi tiết một GroupQLDA
    getGroupQlda = (
        variables?: GetGroupQldaQueryVariables,
        options?: I_GraphQLOptions<GetGroupQldaQuery, I_GroupQLDA>,
    ) => {
        return this.graphqlService.query<GetGroupQldaQuery, GetGroupQldaQueryVariables, I_GroupQLDA>(
            this.getGroupQldaGQL,
            variables,
            {
                normalize: (data) => data.groupQlda,
                ...options,
            },
        ) as Promise<I_GroupQLDA>;
    };

    // Tạo mới một GroupQLDA
    createGroupQlda = (
        variables?: CreateGroupQldaMutationVariables,
        options?: I_GraphQLOptions<CreateGroupQldaMutation, { groupQldaCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateGroupQldaMutation,
            CreateGroupQldaMutationVariables,
            { groupQldaCreate: I_MutationResponse }
        >(this.createGroupQldaGQL, variables, options);
    };

    // Tham gia vào một GroupQLDA
    getGroupQldaJoin = (
        variables?: GetGroupQldaJoinMutationVariables,
        options?: I_GraphQLOptions<GetGroupQldaJoinMutation, { groupQldaJoin: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            GetGroupQldaJoinMutation,
            GetGroupQldaJoinMutationVariables,
            { groupQldaJoin: I_MutationResponse }
        >(this.getGroupQldaJoinGQL, variables, options);
    };
}
