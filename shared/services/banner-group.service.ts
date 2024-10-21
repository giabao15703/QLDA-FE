import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateBannerGroupBannerGQL,
    CreateBannerGroupBannerMutation,
    CreateBannerGroupBannerMutationVariables,
    GetBannerGroupGQL,
    GetBannerGroupQuery,
    GetBannerGroupQueryVariables,
    GetBannerGroupsGQL,
    GetBannerGroupsQuery,
    GetBannerGroupsQueryVariables,
    UpdateBannerGroupBannerGQL,
    UpdateBannerGroupBannerMutation,
    UpdateBannerGroupBannerMutationVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { I_BannerGroup } from 'shared/types/banner-group';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class BannerGroupService {
    constructor(
        private graphqlService: GraphqlService,

        private getBannerGroupGQL: GetBannerGroupGQL,
        private getBannerGroupsGQL: GetBannerGroupsGQL,
        private updateBannerGroupBannerGQL: UpdateBannerGroupBannerGQL,
        private createBannerGroupBannerGQL: CreateBannerGroupBannerGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeBannerGroupList = (
        data: GetBannerGroupsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_BannerGroup> => {
        return normalizeWithPagination<I_BannerGroup>(data.bannerGroupList, extra);
    };

    getBannerGroup = (
        variables?: GetBannerGroupQueryVariables,
        options?: I_GraphQLOptions<GetBannerGroupQuery, I_BannerGroup>,
    ) => {
        return this.graphqlService.query<GetBannerGroupQuery, GetBannerGroupQueryVariables, I_BannerGroup>(
            this.getBannerGroupGQL,
            variables,
            {
                normalize: (data) => data.bannerGroup,
                ...options,
            },
        ) as Promise<I_BannerGroup>;
    };

    getBannerGroups = (
        variables?: GetBannerGroupsQueryVariables,
        options?: I_GraphQLOptions<GetBannerGroupsQuery, I_TableState<I_BannerGroup>>,
    ) => {
        return this.graphqlService.query<
            GetBannerGroupsQuery,
            GetBannerGroupsQueryVariables,
            I_TableState<I_BannerGroup>
        >(this.getBannerGroupsGQL, variables, {
            normalize: (data) => this.normalizeBannerGroupList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_BannerGroup>>;
    };

    createBannerGroup = (
        variables?: CreateBannerGroupBannerMutationVariables,
        options?: I_GraphQLOptions<CreateBannerGroupBannerMutation, { bannerGroupBannerCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateBannerGroupBannerMutation,
            CreateBannerGroupBannerMutationVariables,
            { bannerGroupBannerCreate: I_MutationResponse }
        >(this.createBannerGroupBannerGQL, variables, options);
    };

    updateBannerGroup = (
        variables?: UpdateBannerGroupBannerMutationVariables,
        options?: I_GraphQLOptions<UpdateBannerGroupBannerMutation, { bannerGroupBannerUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateBannerGroupBannerMutation,
            UpdateBannerGroupBannerMutationVariables,
            { bannerGroupBannerUpdate: I_MutationResponse }
        >(this.updateBannerGroupBannerGQL, variables, options);
    };
}
