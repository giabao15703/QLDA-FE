import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateAuctionFeeGQL,
    CreateAuctionFeeMutation,
    CreateAuctionFeeMutationVariables,
    CreateUserDiamondSponsorFeeGQL,
    CreateUserDiamondSponsorFeeMutation,
    CreateUserDiamondSponsorFeeMutationVariables,
    GetAuctionFeeGQL,
    GetAuctionFeeQuery,
    GetAuctionFeeQueryVariables,
    GetAuctionFeesGQL,
    GetAuctionFeesQuery,
    GetAuctionFeesQueryVariables,
    GetPlatformFeeGQL,
    GetPlatformFeeQuery,
    GetPlatformFeeQueryVariables,
    GetPlatformFeesGQL,
    GetPlatformFeesQuery,
    GetPlatformFeesQueryVariables,
    GetProfileFeaturesBuyerGQL,
    GetProfileFeaturesBuyerQuery,
    GetProfileFeaturesBuyerQueryVariables,
    GetProfileFeaturesSupplierGQL,
    GetProfileFeaturesSupplierQuery,
    GetProfileFeaturesSupplierQueryVariables,
    GetSicpRegistrationGQL,
    GetSicpRegistrationQuery,
    GetSicpRegistrationQueryVariables,
    GetSupplierSicpTextEditorGQL,
    GetSupplierSicpTextEditorQuery,
    GetSupplierSicpTextEditorQueryVariables,
    GetUserDiamondSponsorFeeGQL,
    GetUserDiamondSponsorFeeQuery,
    GetUserDiamondSponsorFeeQueryVariables,
    GetUserDiamondSponsorFeesGQL,
    GetUserDiamondSponsorFeesQuery,
    GetUserDiamondSponsorFeesQueryVariables,
    UpdateAuctionFeeGQL,
    UpdateAuctionFeeMutation,
    UpdateAuctionFeeMutationVariables,
    UpdatePlatformFeeGQL,
    UpdatePlatformFeeMutation,
    UpdatePlatformFeeMutationVariables,
    UpdateProfileFeaturesBuyerGQL,
    UpdateProfileFeaturesBuyerMutation,
    UpdateProfileFeaturesBuyerMutationVariables,
    UpdateProfileFeaturesSupplierGQL,
    UpdateProfileFeaturesSupplierMutation,
    UpdateProfileFeaturesSupplierMutationVariables,
    UpdateSicpRegistrationGQL,
    UpdateSicpRegistrationMutation,
    UpdateSicpRegistrationMutationVariables,
    UpdateUserDiamondSponsorFeeGQL,
    UpdateUserDiamondSponsorFeeMutation,
    UpdateUserDiamondSponsorFeeMutationVariables,
} from '#shared/graphql/types';
import {
    I_AuctionFee,
    I_GraphQLOptions,
    I_MutationResponse,
    I_NormalizeExtra,
    I_PlatformFee,
    I_ProfileFeaturesBuyer,
    I_ProfileFeaturesSupplier,
    I_SicpRegistration,
    I_SupplierSicpTextEditor,
    I_TableState,
    I_UserDiamondSponsorFee,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class SaleSchemeService {
    constructor(
        private graphqlService: GraphqlService,

        private getProfileFeaturesBuyerGQL: GetProfileFeaturesBuyerGQL,
        private updateProfileFeaturesBuyerGQL: UpdateProfileFeaturesBuyerGQL,

        private getProfileFeaturesSupplierGQL: GetProfileFeaturesSupplierGQL,
        private updateProfileFeaturesSupplierGQL: UpdateProfileFeaturesSupplierGQL,

        private getPlatformFeesGQL: GetPlatformFeesGQL,
        private getPlatformFeeGQL: GetPlatformFeeGQL,
        private updatePlatformFeeGQL: UpdatePlatformFeeGQL,

        private getUserDiamondSponsorFeesGQL: GetUserDiamondSponsorFeesGQL,
        private getUserDiamondSponsorFeeGQL: GetUserDiamondSponsorFeeGQL,
        private createUserDiamondSponsorFeeGQL: CreateUserDiamondSponsorFeeGQL,
        private updateUserDiamondSponsorFeeGQL: UpdateUserDiamondSponsorFeeGQL,

        private getAuctionFeesGQL: GetAuctionFeesGQL,
        private getAuctionFeeGQL: GetAuctionFeeGQL,
        private createAuctionFeeGQL: CreateAuctionFeeGQL,
        private updateAuctionFeeGQL: UpdateAuctionFeeGQL,

        private getSicpRegistrationGQL: GetSicpRegistrationGQL,
        private updateSicpRegistrationGQL: UpdateSicpRegistrationGQL,
        private getSupplierSicpTextEditorGQL: GetSupplierSicpTextEditorGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    // #region PROFILE FEATURES BUYER
    private normalizeProfileFeaturesBuyerList = (
        data: GetProfileFeaturesBuyerQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_ProfileFeaturesBuyer> => {
        return normalizeWithPagination<I_ProfileFeaturesBuyer>(data.profileFeaturesBuyer, extra);
    };

    getProfileFeaturesBuyer = (
        variables?: GetProfileFeaturesBuyerQueryVariables,
        options?: I_GraphQLOptions<GetProfileFeaturesBuyerQuery, I_TableState<I_ProfileFeaturesBuyer>>,
    ) => {
        return this.graphqlService.query<
            GetProfileFeaturesBuyerQuery,
            GetProfileFeaturesBuyerQueryVariables,
            I_TableState<I_ProfileFeaturesBuyer>
        >(this.getProfileFeaturesBuyerGQL, variables, {
            normalize: (data) => this.normalizeProfileFeaturesBuyerList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_ProfileFeaturesBuyer>>;
    };

    updateProfileFeaturesBuyer = (
        variables?: UpdateProfileFeaturesBuyerMutationVariables,
        options?: I_GraphQLOptions<
            UpdateProfileFeaturesBuyerMutation,
            { profileFeaturesBuyerUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateProfileFeaturesBuyerMutation,
            UpdateProfileFeaturesBuyerMutationVariables,
            { profileFeaturesBuyerUpdate: I_MutationResponse }
        >(this.updateProfileFeaturesBuyerGQL, variables, options);
    };
    // #endregion

    // #region PROFILE FEATURES SUPPLIER
    private normalizeProfileFeaturesSupplierList = (
        data: GetProfileFeaturesSupplierQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_ProfileFeaturesSupplier> => {
        return normalizeWithPagination<I_ProfileFeaturesSupplier>(data.profileFeaturesSupplier, extra);
    };

    getProfileFeaturesSupplier = (
        variables?: GetProfileFeaturesSupplierQueryVariables,
        options?: I_GraphQLOptions<GetProfileFeaturesSupplierQuery, I_TableState<I_ProfileFeaturesSupplier>>,
    ) => {
        return this.graphqlService.query<
            GetProfileFeaturesSupplierQuery,
            GetProfileFeaturesSupplierQueryVariables,
            I_TableState<I_ProfileFeaturesSupplier>
        >(this.getProfileFeaturesSupplierGQL, variables, {
            normalize: (data) => this.normalizeProfileFeaturesSupplierList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_ProfileFeaturesSupplier>>;
    };

    updateProfileFeaturesSupplier = (
        variables?: UpdateProfileFeaturesSupplierMutationVariables,
        options?: I_GraphQLOptions<
            UpdateProfileFeaturesSupplierMutation,
            { profileFeaturesSupplierUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateProfileFeaturesSupplierMutation,
            UpdateProfileFeaturesSupplierMutationVariables,
            { profileFeaturesSupplierUpdate: I_MutationResponse }
        >(this.updateProfileFeaturesSupplierGQL, variables, options);
    };
    // #endregion

    // #region SICP
    private normalizeSicpRegistrationList = (
        data: GetSicpRegistrationQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_SicpRegistration> => {
        return normalizeWithPagination<I_SicpRegistration>(data.sicpRegistration, extra);
    };

    getSicpRegistration = (
        variables?: GetSicpRegistrationQueryVariables,
        options?: I_GraphQLOptions<GetSicpRegistrationQuery, I_TableState<I_SicpRegistration>>,
    ) => {
        return this.graphqlService.query<
            GetSicpRegistrationQuery,
            GetSicpRegistrationQueryVariables,
            I_TableState<I_SicpRegistration>
        >(this.getSicpRegistrationGQL, variables, {
            normalize: (data) => this.normalizeSicpRegistrationList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_SicpRegistration>>;
    };

    updateSicpRegistration = (
        variables?: UpdateSicpRegistrationMutationVariables,
        options?: I_GraphQLOptions<UpdateSicpRegistrationMutation, { sicpRegistrationUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateSicpRegistrationMutation,
            UpdateSicpRegistrationMutationVariables,
            { sicpRegistrationUpdate: I_MutationResponse }
        >(this.updateSicpRegistrationGQL, variables, options);
    };

    private normalizeSupplierSicpTextEditor = (
        data: GetSupplierSicpTextEditorQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_SupplierSicpTextEditor> => {
        return normalizeWithPagination<I_SupplierSicpTextEditor>(data.userSupplierSicpTextEditor, extra);
    };

    getSupplierSicpTextEditor = (
        variables?: GetSupplierSicpTextEditorQueryVariables,
        options?: I_GraphQLOptions<GetSupplierSicpTextEditorQuery, I_TableState<I_SupplierSicpTextEditor>>,
    ) => {
        return this.graphqlService.query<
            GetSupplierSicpTextEditorQuery,
            GetSupplierSicpTextEditorQueryVariables,
            I_TableState<I_SupplierSicpTextEditor>
        >(this.getSupplierSicpTextEditorGQL, variables, {
            normalize: (data) => this.normalizeSupplierSicpTextEditor(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_SupplierSicpTextEditor>>;
    };
    // #endregion

    // #region Flatrate
    private normalizePlatformFeeList = (
        data: GetPlatformFeesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_PlatformFee> => {
        return normalizeWithPagination<I_PlatformFee>(data.platformFees, extra);
    };

    getPlatformFees = (
        variables?: GetPlatformFeesQueryVariables,
        options?: I_GraphQLOptions<GetPlatformFeesQuery, I_TableState<I_PlatformFee>>,
    ) => {
        return this.graphqlService.query<
            GetPlatformFeesQuery,
            GetPlatformFeesQueryVariables,
            I_TableState<I_PlatformFee>
        >(this.getPlatformFeesGQL, variables, {
            normalize: (data) => this.normalizePlatformFeeList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_PlatformFee>>;
    };

    getPlatformFee = (
        variables?: GetPlatformFeeQueryVariables,
        options?: I_GraphQLOptions<GetPlatformFeeQuery, I_PlatformFee>,
    ) => {
        return this.graphqlService.query<GetPlatformFeeQuery, GetPlatformFeeQueryVariables, I_PlatformFee>(
            this.getPlatformFeeGQL,
            variables,
            {
                normalize: (data) => data.platformFee,
                ...options,
            },
        ) as Promise<I_PlatformFee>;
    };
    updatePlatformFee = (
        variables?: UpdatePlatformFeeMutationVariables,
        options?: I_GraphQLOptions<UpdatePlatformFeeMutation, { platformFeeUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdatePlatformFeeMutation,
            UpdatePlatformFeeMutationVariables,
            { platformFeeUpdate: I_MutationResponse }
        >(this.updatePlatformFeeGQL, variables, options);
    };

    // #endregion

    // #region UserDiamondSponsorFee
    private normalizeUserDiamondSponsorFeeList = (
        data: GetUserDiamondSponsorFeesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_UserDiamondSponsorFee> => {
        return normalizeWithPagination<I_UserDiamondSponsorFee>(data.userDiamondSponsorFees, extra);
    };

    getUserDiamondSponsorFees = (
        variables?: GetUserDiamondSponsorFeesQueryVariables,
        options?: I_GraphQLOptions<GetUserDiamondSponsorFeesQuery, I_TableState<I_UserDiamondSponsorFee>>,
    ) => {
        return this.graphqlService.query<
            GetUserDiamondSponsorFeesQuery,
            GetUserDiamondSponsorFeesQueryVariables,
            I_TableState<I_UserDiamondSponsorFee>
        >(this.getUserDiamondSponsorFeesGQL, variables, {
            normalize: (data) => this.normalizeUserDiamondSponsorFeeList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_UserDiamondSponsorFee>>;
    };

    getUserDiamondSponsorFee = (
        variables?: GetUserDiamondSponsorFeeQueryVariables,
        options?: I_GraphQLOptions<GetUserDiamondSponsorFeeQuery, I_UserDiamondSponsorFee>,
    ) => {
        return this.graphqlService.query<
            GetUserDiamondSponsorFeeQuery,
            GetUserDiamondSponsorFeeQueryVariables,
            I_UserDiamondSponsorFee
        >(this.getUserDiamondSponsorFeeGQL, variables, {
            normalize: (data) => data.userDiamondSponsorFee,
            ...options,
        }) as Promise<I_UserDiamondSponsorFee>;
    };
    createUserDiamondSponsorFee = (
        variables?: CreateUserDiamondSponsorFeeMutationVariables,
        options?: I_GraphQLOptions<
            CreateUserDiamondSponsorFeeMutation,
            { userDiamondSponsorFeeCreate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            CreateUserDiamondSponsorFeeMutation,
            CreateUserDiamondSponsorFeeMutationVariables,
            { userDiamondSponsorFeeCreate: I_MutationResponse }
        >(this.createUserDiamondSponsorFeeGQL, variables, options);
    };
    updateUserDiamondSponsorFee = (
        variables?: UpdateUserDiamondSponsorFeeMutationVariables,
        options?: I_GraphQLOptions<
            UpdateUserDiamondSponsorFeeMutation,
            { userDiamondSponsorFeeUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateUserDiamondSponsorFeeMutation,
            UpdateUserDiamondSponsorFeeMutationVariables,
            { userDiamondSponsorFeeUpdate: I_MutationResponse }
        >(this.updateUserDiamondSponsorFeeGQL, variables, options);
    };
    // #endregion

    // #region AuctionFee
    private normalizeAuctionFeeList = (
        data: GetAuctionFeesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_AuctionFee> => {
        return normalizeWithPagination<I_AuctionFee>(data.auctionFees, extra);
    };

    getAuctionFee = (
        variables?: GetAuctionFeeQueryVariables,
        options?: I_GraphQLOptions<GetAuctionFeeQuery, I_AuctionFee>,
    ) => {
        return this.graphqlService.query<GetAuctionFeeQuery, GetAuctionFeeQueryVariables, I_AuctionFee>(
            this.getAuctionFeeGQL,
            variables,
            {
                normalize: (data) => data.auctionFee,
                ...options,
            },
        ) as Promise<I_AuctionFee>;
    };

    getAuctionFees = (
        variables?: GetAuctionFeesQueryVariables,
        options?: I_GraphQLOptions<GetAuctionFeesQuery, I_TableState<I_AuctionFee>>,
    ) => {
        return this.graphqlService.query<GetAuctionFeesQuery, GetAuctionFeesQueryVariables, I_TableState<I_AuctionFee>>(
            this.getAuctionFeesGQL,
            variables,
            {
                normalize: (data) => this.normalizeAuctionFeeList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_AuctionFee>>;
    };

    createAuctionFee = (
        variables?: CreateAuctionFeeMutationVariables,
        options?: I_GraphQLOptions<CreateAuctionFeeMutation, { auctionFeeCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateAuctionFeeMutation,
            CreateAuctionFeeMutationVariables,
            { auctionFeeCreate: I_MutationResponse }
        >(this.createAuctionFeeGQL, variables, options);
    };
    updateAuctionFee = (
        variables?: UpdateAuctionFeeMutationVariables,
        options?: I_GraphQLOptions<UpdateAuctionFeeMutation, { auctionFeeUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateAuctionFeeMutation,
            UpdateAuctionFeeMutationVariables,
            { auctionFeeUpdate: I_MutationResponse }
        >(this.updateAuctionFeeGQL, variables, options);
    };
}
