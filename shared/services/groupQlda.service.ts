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
    AcceptJoinRequestGQL,
    AcceptJoinRequestMutation,
    AcceptJoinRequestMutationVariables,
    GetGroupQldaRequestsGQL,
    GetGroupQldaRequestsQuery,
    GetGroupQldaRequestsQueryVariables,
    GetJoinGroupsQuery,
    GetJoinGroupsQueryVariables,
    GetJoinGroupsGQL,
    GetStudentsWithoutGroupQuery,
    GetStudentsWithoutGroupQueryVariables,
    GetStudentsWithoutGroupGQL,
    GetInviteUserToGroupMutation,
    GetInviteUserToGroupMutationVariables,
    GetInviteUserToGroupGQL,
} from '#shared/graphql/types';
import { E_Role, I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState, I_User } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphqlService } from './core/graphql.service';
import { I_GroupQLDA, I_JoinGroup, I_JoinRequest } from 'shared/types/group';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class GroupQLDAService {
    constructor(
        private graphqlService: GraphqlService,
        private getGroupQldasGQL: GetGroupQldasGQL, // Lấy danh sách GroupQLDA
        private getGroupQldaGQL: GetGroupQldaGQL, // Lấy chi tiết GroupQLDA
        private createGroupQldaGQL: CreateGroupQldaGQL, // Tạo GroupQLDA
        private getGroupQldaJoinGQL: GetGroupQldaJoinGQL,
        private acceptJoinRequestGQL: AcceptJoinRequestGQL,
        private getGroupQldaRequestsGQL: GetGroupQldaRequestsGQL,
        private getJoinGroupsGQL: GetJoinGroupsGQL,
        private getStudentsWithoutGroupGQL: GetStudentsWithoutGroupGQL,
        private getInviteUserToGroupGQL: GetInviteUserToGroupGQL,
        private http: HttpClient,
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
                normalize: (data) => {
                    const groupQlda = data.groupQlda as unknown as I_GroupQLDA;
                    return groupQlda;
                },
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
    acceptJoinRequest = (
        variables?: AcceptJoinRequestMutationVariables,
        options?: I_GraphQLOptions<AcceptJoinRequestMutation, { acceptJoinRequest: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            AcceptJoinRequestMutation,
            AcceptJoinRequestMutationVariables,
            { acceptJoinRequest: I_MutationResponse }
        >(this.acceptJoinRequestGQL, variables, options);
    };
    private normalizeGroupQldaRequestList = (
        data: GetGroupQldaRequestsQuery,
        extra?: I_NormalizeExtra,
    ): I_JoinRequest[] => {
        return data.joinRequests.edges.map((edge) => edge.node);
    };

    getGroupQldaRequests = (
        variables?: GetGroupQldaRequestsQueryVariables,
        options?: I_GraphQLOptions<GetGroupQldaRequestsQuery, I_JoinRequest[]>,
    ) => {
        return this.graphqlService.query<
            GetGroupQldaRequestsQuery,
            GetGroupQldaRequestsQueryVariables,
            I_JoinRequest[]
        >(this.getGroupQldaRequestsGQL, variables, {
            normalize: (data) => this.normalizeGroupQldaRequestList(data, options?.extra),
            ...options,
        }) as Promise<I_JoinRequest[]>; // Ensure this returns an array of I_JoinRequest
    };

    private normalizeJoinGroupList = (
        data: GetJoinGroupsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_JoinGroup> => {
        return normalizeWithPagination<I_JoinGroup>(data.joinGroups, extra);
    };

    getJoinGroups = (
        variables?: GetJoinGroupsQueryVariables,
        options?: I_GraphQLOptions<GetJoinGroupsQuery, I_TableState<I_JoinGroup>>,
    ) => {
        return this.graphqlService.query<GetJoinGroupsQuery, GetJoinGroupsQueryVariables, I_TableState<I_JoinGroup>>(
            this.getJoinGroupsGQL,
            variables,
            {
                normalize: (data) => this.normalizeJoinGroupList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_JoinGroup>>;
    };
    private normalizeStudentsWithoutGroupList = (
        data: GetStudentsWithoutGroupQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_User> => {
        // Trả về toàn bộ dữ liệu mà không cần phân trang
        return { data: data.studentsWithoutGroup || [] };
    };

    getStudentsWithoutGroup = (
        variables?: GetStudentsWithoutGroupQueryVariables,
        options?: I_GraphQLOptions<GetStudentsWithoutGroupQuery, I_TableState<I_User>>,
    ) => {
        return this.graphqlService.query<
            GetStudentsWithoutGroupQuery,
            GetStudentsWithoutGroupQueryVariables,
            I_TableState<I_User>
        >(this.getStudentsWithoutGroupGQL, variables, {
            normalize: (data) => {
                return this.normalizeStudentsWithoutGroupList(data, options?.extra);
            },
            ...options,
        }) as Promise<I_TableState<I_User>>;
    };
    getInviteUserToGroup = (
        variables?: GetInviteUserToGroupMutationVariables,
        options?: I_GraphQLOptions<GetInviteUserToGroupMutation, { inviteUserToGroup: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            GetInviteUserToGroupMutation,
            GetInviteUserToGroupMutationVariables,
            { inviteUserToGroup: I_MutationResponse }
        >(this.getInviteUserToGroupGQL, variables, options);
    };
    getGroupsByUser(userId: string) {
        return this.http.get<I_GroupQLDA[]>(`/api/groups/`, {
            params: { user_id: userId },
        });
    }
}
