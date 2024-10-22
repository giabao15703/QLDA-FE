import {
    CreateGiangVienGQL,
    CreateGiangVienMutation,
    CreateGiangVienMutationVariables,
    GetGiangVienGQL,
    GetGiangVienQuery,
    GetGiangVienQueryVariables,
    GetGiangViensGQL,
    GetGiangViensQuery,
    GetGiangViensQueryVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { I_GiangVien } from 'shared/types/giangvien'; // Đổi sang kiểu GiangVien
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class GiangVienService {
    constructor(
        private graphqlService: GraphqlService,
        private getGiangViensGQL: GetGiangViensGQL, // Đổi hàm lấy danh sách GiangVien
        private getGiangVienGQL: GetGiangVienGQL, // Đổi hàm lấy chi tiết GiangVien
        private createGiangVienGQL: CreateGiangVienGQL, // Đổi hàm tạo GiangVien
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeGiangVienList = (
        data: GetGiangViensQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_GiangVien> => {
        return normalizeWithPagination<I_GiangVien>(data.giangViens, extra);
    };

    // Lấy danh sách Giảng Viên
    getGiangViens = (
        variables?: GetGiangViensQueryVariables,
        options?: I_GraphQLOptions<GetGiangViensQuery, I_TableState<I_GiangVien>>,
    ) => {
        return this.graphqlService.query<GetGiangViensQuery, GetGiangViensQueryVariables, I_TableState<I_GiangVien>>(
            this.getGiangViensGQL,
            variables,
            {
                normalize: (data) => this.normalizeGiangVienList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_GiangVien>>;
    };

    // Lấy chi tiết một Giảng Viên
    getGiangVien = (
        variables?: GetGiangVienQueryVariables,
        options?: I_GraphQLOptions<GetGiangVienQuery, I_GiangVien>,
    ) => {
        return this.graphqlService.query<GetGiangVienQuery, GetGiangVienQueryVariables, I_GiangVien>(
            this.getGiangVienGQL,
            variables,
            {
                normalize: (data) => data.giangVien,
                ...options,
            },
        ) as Promise<I_GiangVien>;
    };

    // Tạo mới một Giảng Viên
    createGiangVien = (
        variables?: CreateGiangVienMutationVariables,
        options?: I_GraphQLOptions<CreateGiangVienMutation, { giangVienCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateGiangVienMutation,
            CreateGiangVienMutationVariables,
            { giangVienCreate: I_MutationResponse }
        >(this.createGiangVienGQL, variables, options);
    };
}
