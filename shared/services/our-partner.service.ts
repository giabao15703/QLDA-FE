import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateOurPartnerGQL,
    CreateOurPartnerMutation,
    CreateOurPartnerMutationVariables,
    GetOurPartnerGQL,
    GetOurPartnerQuery,
    GetOurPartnerQueryVariables,
    GetOurPartnersGQL,
    GetOurPartnersQuery,
    GetOurPartnersQueryVariables,
    UpdateOurPartnerGQL,
    UpdateOurPartnerMutation,
    UpdateOurPartnerMutationVariables,
    UpdateOurPartnerStatusGQL,
    UpdateOurPartnerStatusMutation,
    UpdateOurPartnerStatusMutationVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_OurPartner, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class OurPartnerService {
    constructor(
        private graphqlService: GraphqlService,
        private getOurPartnersGQL: GetOurPartnersGQL,
        private getOurPartnerGQL: GetOurPartnerGQL,
        private createOurPartnerGQL: CreateOurPartnerGQL,
        private updateOurPartnerGQL: UpdateOurPartnerGQL,
        private updateOurPartnerStatusGQL: UpdateOurPartnerStatusGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeOurPartnerList = (
        data: GetOurPartnersQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_OurPartner> => {
        return normalizeWithPagination<I_OurPartner>(data.ourPartners, extra);
    };

    getOurPartners = (
        variables?: GetOurPartnersQueryVariables,
        options?: I_GraphQLOptions<GetOurPartnersQuery, I_TableState<I_OurPartner>>,
    ) => {
        return this.graphqlService.query<GetOurPartnersQuery, GetOurPartnersQueryVariables, I_TableState<I_OurPartner>>(
            this.getOurPartnersGQL,
            variables,
            {
                normalize: (data) => this.normalizeOurPartnerList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_OurPartner>>;
    };

    getOurPartner = (
        variables?: GetOurPartnerQueryVariables,
        options?: I_GraphQLOptions<GetOurPartnerQuery, I_OurPartner>,
    ) => {
        return this.graphqlService.query<GetOurPartnerQuery, GetOurPartnerQueryVariables, I_OurPartner>(
            this.getOurPartnerGQL,
            variables,
            {
                normalize: (data) => data.ourPartner,
                ...options,
            },
        ) as Promise<I_OurPartner>;
    };

    createOurPartner = (
        variables?: CreateOurPartnerMutationVariables,
        options?: I_GraphQLOptions<CreateOurPartnerMutation, { ourPartnerCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateOurPartnerMutation,
            CreateOurPartnerMutationVariables,
            { ourPartnerCreate: I_MutationResponse }
        >(this.createOurPartnerGQL, variables, options);
    };

    updateOurPartner = (
        variables?: UpdateOurPartnerMutationVariables,
        options?: I_GraphQLOptions<UpdateOurPartnerMutation, { ourPartnerUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateOurPartnerMutation,
            UpdateOurPartnerMutationVariables,
            { ourPartnerUpdate: I_MutationResponse }
        >(this.updateOurPartnerGQL, variables, options);
    };

    updateOurPartnerStatus = (
        variables?: UpdateOurPartnerStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateOurPartnerStatusMutation, { ourPartnerUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateOurPartnerStatusMutation,
            UpdateOurPartnerStatusMutationVariables,
            { ourPartnerUpdateStatus: I_MutationResponse }
        >(this.updateOurPartnerStatusGQL, variables, options);
    };
}
