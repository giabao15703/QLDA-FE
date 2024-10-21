import {
    CreateDiamondSponsorTextEditerGQL,
    CreateDiamondSponsorTextEditerMutation,
    CreateDiamondSponsorTextEditerMutationVariables,
    GetUserDiamondSponsorGQL,
    GetUserDiamondSponsorQuery,
    GetUserDiamondSponsorQueryVariables,
    GetUserDiamondSponsorsGQL,
    GetUserDiamondSponsorsQuery,
    GetUserDiamondSponsorsQueryVariables,
    UpdateUserDiamondSponsorGQL,
    UpdateUserDiamondSponsorIsConfirmedGQL,
    UpdateUserDiamondSponsorIsConfirmedMutation,
    UpdateUserDiamondSponsorIsConfirmedMutationVariables,
    UpdateUserDiamondSponsorMutation,
    UpdateUserDiamondSponsorMutationVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { I_UserDiamondSponsor } from 'shared/types/diamond-sponsor';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class DiamondSponsorDataService {
    constructor(
        private graphqlService: GraphqlService,
        private getUserDiamondSponsorsGQL: GetUserDiamondSponsorsGQL,
        private getUserDiamondSponsorGQL: GetUserDiamondSponsorGQL,
        private updateUserDiamondSponsorGQL: UpdateUserDiamondSponsorGQL,
        private updateUserDiamondSponsorIsConfirmedGQL: UpdateUserDiamondSponsorIsConfirmedGQL,
        private createDiamondSponsorTextEditerGQL: CreateDiamondSponsorTextEditerGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeUserDiamondSponsorList = (
        data: GetUserDiamondSponsorsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_UserDiamondSponsor> => {
        return normalizeWithPagination<I_UserDiamondSponsor>(data.userDiamondSponsors, extra);
    };

    getUserDiamondSponsors = (
        variables?: GetUserDiamondSponsorsQueryVariables,
        options?: I_GraphQLOptions<GetUserDiamondSponsorsQuery, I_TableState<I_UserDiamondSponsor>>,
    ) => {
        return this.graphqlService.query<
            GetUserDiamondSponsorsQuery,
            GetUserDiamondSponsorsQueryVariables,
            I_TableState<I_UserDiamondSponsor>
        >(this.getUserDiamondSponsorsGQL, variables, {
            normalize: (data) => this.normalizeUserDiamondSponsorList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_UserDiamondSponsor>>;
    };

    getUserDiamondSponsor = (
        variables?: GetUserDiamondSponsorQueryVariables,
        options?: I_GraphQLOptions<GetUserDiamondSponsorQuery, I_UserDiamondSponsor>,
    ) => {
        return this.graphqlService.query<
            GetUserDiamondSponsorQuery,
            GetUserDiamondSponsorQueryVariables,
            I_UserDiamondSponsor
        >(this.getUserDiamondSponsorGQL, variables, {
            normalize: (data) => data.userDiamondSponsor,
            ...options,
        }) as Promise<I_UserDiamondSponsor>;
    };

    updateUserDiamondSponsor = (
        variables?: UpdateUserDiamondSponsorMutationVariables,
        options?: I_GraphQLOptions<UpdateUserDiamondSponsorMutation, { userDiamondSponsorUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateUserDiamondSponsorMutation,
            UpdateUserDiamondSponsorMutationVariables,
            { userDiamondSponsorUpdate: I_MutationResponse }
        >(this.updateUserDiamondSponsorGQL, variables, options);
    };

    updateUserDiamondSponsorIsConfirmed = (
        variables?: UpdateUserDiamondSponsorIsConfirmedMutationVariables,
        options?: I_GraphQLOptions<
            UpdateUserDiamondSponsorIsConfirmedMutation,
            { userUserDiamondSponsorIsConfirmedUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateUserDiamondSponsorIsConfirmedMutation,
            UpdateUserDiamondSponsorIsConfirmedMutationVariables,
            { userUserDiamondSponsorIsConfirmedUpdate: I_MutationResponse }
        >(this.updateUserDiamondSponsorIsConfirmedGQL, variables, options);
    };

    createDiamondSponsorTextEditer = (
        variables?: CreateDiamondSponsorTextEditerMutationVariables,
        options?: I_GraphQLOptions<
            CreateDiamondSponsorTextEditerMutation,
            { userDiamondSponsorCreateTextEditer: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            CreateDiamondSponsorTextEditerMutation,
            CreateDiamondSponsorTextEditerMutationVariables,
            { userDiamondSponsorCreateTextEditer: I_MutationResponse }
        >(this.createDiamondSponsorTextEditerGQL, variables, options);
    };
}
