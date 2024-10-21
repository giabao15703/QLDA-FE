import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateUserSupplierSicpGQL,
    CreateUserSupplierSicpMutation,
    CreateUserSupplierSicpMutationVariables,
    CreateUserSupplierSicpTextEditorGQL,
    CreateUserSupplierSicpTextEditorMutation,
    CreateUserSupplierSicpTextEditorMutationVariables,
    GetUserSupplierSicpGQL,
    GetUserSupplierSicpQuery,
    GetUserSupplierSicpQueryVariables,
    GetUserSupplierSicpTextEditorGQL,
    GetUserSupplierSicpTextEditorQuery,
    GetUserSupplierSicpTextEditorQueryVariables,
    GetUserSupplierSicpsGQL,
    GetUserSupplierSicpsQuery,
    GetUserSupplierSicpsQueryVariables,
    UpdateUserSupplierSicpGQL,
    UpdateUserSupplierSicpMutation,
    UpdateUserSupplierSicpMutationVariables,
} from '#shared/graphql/types';
import {
    I_GraphQLOptions,
    I_MutationResponse,
    I_NormalizeExtra,
    I_Sicp,
    I_SicpTextEditor,
    I_TableState,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class UserSupplierSicpService {
    constructor(
        private graphqlService: GraphqlService,
        private getUserSupplierSicpGQL: GetUserSupplierSicpGQL,
        private getUserSupplierSicpsGQL: GetUserSupplierSicpsGQL,
        private updateUserSupplierSicpGQL: UpdateUserSupplierSicpGQL,
        private createUserSupplierSicpGQL: CreateUserSupplierSicpGQL,
        private getUserSupplierSicpTextEditorGQL: GetUserSupplierSicpTextEditorGQL,
        private createUserSupplierSicpTextEditorGQL: CreateUserSupplierSicpTextEditorGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeUserSupplierSicps = (
        data: GetUserSupplierSicpsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_Sicp> => {
        return normalizeWithPagination<I_Sicp>(data.userSupplierSicps, extra);
    };

    getUserSupplierSicps = (
        variables?: GetUserSupplierSicpsQueryVariables,
        options?: I_GraphQLOptions<GetUserSupplierSicpsQuery, I_TableState<I_Sicp>>,
    ) => {
        return this.graphqlService.query<
            GetUserSupplierSicpsQuery,
            GetUserSupplierSicpsQueryVariables,
            I_TableState<I_Sicp>
        >(this.getUserSupplierSicpsGQL, variables, {
            normalize: (data) => this.normalizeUserSupplierSicps(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_Sicp>>;
    };

    getUserSupplierSicp = (
        variables?: GetUserSupplierSicpQueryVariables,
        options?: I_GraphQLOptions<GetUserSupplierSicpQuery, I_Sicp>,
    ) => {
        return this.graphqlService.query<GetUserSupplierSicpQuery, GetUserSupplierSicpQueryVariables, I_Sicp>(
            this.getUserSupplierSicpGQL,
            variables,
            {
                normalize: (data) => data.userSupplierSicp,
                ...options,
            },
        ) as Promise<I_Sicp>;
    };

    updateUserSupplierSicp = (
        variables?: UpdateUserSupplierSicpMutationVariables,
        options?: I_GraphQLOptions<UpdateUserSupplierSicpMutation, { bannerGroupUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateUserSupplierSicpMutation,
            UpdateUserSupplierSicpMutationVariables,
            { bannerGroupUpdate: I_MutationResponse }
        >(this.updateUserSupplierSicpGQL, variables, options);
    };

    createUserSupplierSicp = (
        variables?: CreateUserSupplierSicpMutationVariables,
        options?: I_GraphQLOptions<CreateUserSupplierSicpMutation, { languageCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateUserSupplierSicpMutation,
            CreateUserSupplierSicpMutationVariables,
            { languageCreate: I_MutationResponse }
        >(this.createUserSupplierSicpGQL, variables, options);
    };

    private normalizeUserSupplierSicpTextEditor = (
        data: GetUserSupplierSicpTextEditorQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_SicpTextEditor> => {
        return normalizeWithPagination<I_SicpTextEditor>(data.userSupplierSicpTextEditor, extra);
    };

    getUserSupplierSicpTextEditor = (
        variables?: GetUserSupplierSicpTextEditorQueryVariables,
        options?: I_GraphQLOptions<GetUserSupplierSicpTextEditorQuery, I_TableState<I_SicpTextEditor>>,
    ) => {
        return this.graphqlService.query<
            GetUserSupplierSicpTextEditorQuery,
            GetUserSupplierSicpTextEditorQueryVariables,
            I_TableState<I_SicpTextEditor>
        >(this.getUserSupplierSicpTextEditorGQL, variables, {
            normalize: (data) => this.normalizeUserSupplierSicpTextEditor(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_SicpTextEditor>>;
    };

    createUserSupplierSicpTextEditor = (
        variables?: CreateUserSupplierSicpTextEditorMutationVariables,
        options?: I_GraphQLOptions<
            CreateUserSupplierSicpTextEditorMutation,
            { userSupplierSicpTextEditorCreate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            CreateUserSupplierSicpTextEditorMutation,
            CreateUserSupplierSicpTextEditorMutationVariables,
            { userSupplierSicpTextEditorCreate: I_MutationResponse }
        >(this.createUserSupplierSicpTextEditorGQL, variables, options);
    };
}
