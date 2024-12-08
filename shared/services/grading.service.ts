import {
    CreateGradingGQL,
    CreateGradingMutation,
    CreateGradingMutationVariables,
    GetGradingGQL,
    GetGradingQuery,
    GetGradingQueryVariables,
    GetGradingsGQL,
    GetGradingsQuery,
    GetGradingsQueryVariables,
    UpdateGradingGQL,
    UpdateGradingMutation,
    UpdateGradingMutationVariables,
} from '#shared/graphql/types';
import {
    AdminRole,
    E_Role,
    I_DeTai,
    I_GraphQLOptions,
    I_MutationResponse,
    I_NormalizeExtra,
    I_TableState,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { I_Grading } from 'shared/types/grading';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class GradingService {
    constructor(
        private graphqlService: GraphqlService,
        private getGradingsGQL: GetGradingsGQL,
        private getGradingGQL: GetGradingGQL,
        private createGradingGQL: CreateGradingGQL,
        private updateGradingGQL: UpdateGradingGQL,
    ) { }

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeGradingList = (data: GetGradingsQuery, extra?: I_NormalizeExtra): I_TableState<I_Grading> => {
        return normalizeWithPagination<I_Grading>(data.gradings, extra);
    };

    getGradings = (
        variables?: GetGradingsQueryVariables,
        options?: I_GraphQLOptions<GetGradingsQuery, I_TableState<I_Grading>>,
    ) => {
        return this.graphqlService.query<GetGradingsQuery, GetGradingsQueryVariables, I_TableState<I_Grading>>(
            this.getGradingsGQL,
            variables,
            {
                normalize: (data) => this.normalizeGradingList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Grading>>;
    };

    getGrading = (variables?: GetGradingQueryVariables, options?: I_GraphQLOptions<GetGradingQuery, I_Grading>) => {
        return this.graphqlService.query<GetGradingQuery, GetGradingQueryVariables, I_Grading>(
            this.getGradingGQL,
            variables,
            {
                normalize: (data) => {
                    if (!data.grading) {
                        throw new Error('Grading data is null or undefined');
                    }

                    const gradingNode = data.grading;

                    // Kiểm tra và chuyển đổi role từ AdminRole sang E_Role nếu cần
                    const convertRole = (role: AdminRole | E_Role): E_Role => {
                        // Giả sử bạn có cách chuyển đổi từ AdminRole sang E_Role
                        // Nếu chúng giống nhau, bạn có thể bỏ qua hàm này
                        return role as E_Role;
                    };

                    const grading: I_Grading = {
                        id: gradingNode.id,
                        diemHuongdan: gradingNode.diemHuongdan,
                        diemPhanbien: gradingNode.diemPhanbien,
                        detai: {
                            ...gradingNode.detai,
                            mota: gradingNode.detai.mota || '',
                            idgvhuongdan: gradingNode.detai.idgvhuongdan
                                ? {
                                    ...gradingNode.detai.idgvhuongdan,
                                    role: data.grading.detai.idgvhuongdan.role as unknown as AdminRole,
                                }
                                : null,
                            idgvphanbien: gradingNode.detai.idgvphanbien
                                ? {
                                    ...gradingNode.detai.idgvphanbien,
                                    role: data.grading.detai.idgvhuongdan.role as unknown as AdminRole,
                                }
                                : null,
                            // Chuyển đổi hoặc thêm các thuộc tính khác của I_DeTai nếu cần
                        },
                    };

                    return grading;
                },
                ...options,
            },
        ) as Promise<I_Grading>;
    };

    createGrading = (
        variables?: CreateGradingMutationVariables,
        options?: I_GraphQLOptions<CreateGradingMutation, { createGrading: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateGradingMutation,
            CreateGradingMutationVariables,
            { createGrading: I_MutationResponse }
        >(this.createGradingGQL, variables, options);
    };

    updateGrading = (
        variables?: UpdateGradingMutationVariables,
        options?: I_GraphQLOptions<UpdateGradingMutation, { updateGrading: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateGradingMutation,
            UpdateGradingMutationVariables,
            { updateGrading: I_MutationResponse }
        >(this.updateGradingGQL, variables, options);
    };
}
