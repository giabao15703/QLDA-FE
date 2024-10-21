import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateCourseGQL,
    CreateCourseMutation,
    CreateCourseMutationVariables,
    CreateModuleGQL,
    CreateModuleMutation,
    CreateModuleMutationVariables,
    GetCourseGQL,
    GetCourseQuery,
    GetCourseQueryVariables,
    GetCoursesGQL,
    GetCoursesQuery,
    GetCoursesQueryVariables,
    GetModuleGQL,
    GetModuleQuery,
    GetModuleQueryVariables,
    GetModulesGQL,
    GetModulesQuery,
    GetModulesQueryVariables,
    UpdateCourseGQL,
    UpdateCourseMutation,
    UpdateCourseMutationVariables,
    UpdateCourseStatusGQL,
    UpdateCourseStatusMutation,
    UpdateCourseStatusMutationVariables,
    UpdateModuleGQL,
    UpdateModuleMutation,
    UpdateModuleMutationVariables,
    UpdateModuleStatusGQL,
    UpdateModuleStatusMutation,
    UpdateModuleStatusMutationVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_MutationResponse, I_NormalizeExtra, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { I_Course, I_Module } from 'shared/types/user-guide';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class UserGuideService {
    constructor(
        private graphqlService: GraphqlService,

        private getModulesGQL: GetModulesGQL,
        private getModuleGQL: GetModuleGQL,
        private createModuleGQL: CreateModuleGQL,
        private updateModuleGQL: UpdateModuleGQL,
        private updateModuleStatusGQL: UpdateModuleStatusGQL,

        private getCoursesGQL: GetCoursesGQL,
        private getCourseGQL: GetCourseGQL,
        private createCourseGQL: CreateCourseGQL,
        private updateCourseGQL: UpdateCourseGQL,
        private updateCourseStatusGQL: UpdateCourseStatusGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    // #region MODULE
    private normalizeModuleList = (data: GetModulesQuery, extra?: I_NormalizeExtra): I_TableState<I_Module> => {
        return normalizeWithPagination<I_Module>(data.modules, extra);
    };

    getModule = (variables?: GetModuleQueryVariables, options?: I_GraphQLOptions<GetModuleQuery, I_Module>) => {
        return this.graphqlService.query<GetModuleQuery, GetModuleQueryVariables, I_Module>(
            this.getModuleGQL,
            variables,
            {
                normalize: (data) => data.module,
                ...options,
            },
        ) as Promise<I_Module>;
    };

    getModules = (
        variables?: GetModulesQueryVariables,
        options?: I_GraphQLOptions<GetModulesQuery, I_TableState<I_Module>>,
    ) => {
        return this.graphqlService.query<GetModulesQuery, GetModulesQueryVariables, I_TableState<I_Module>>(
            this.getModulesGQL,
            variables,
            {
                normalize: (data) => this.normalizeModuleList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Module>>;
    };

    createModule = (
        variables?: CreateModuleMutationVariables,
        options?: I_GraphQLOptions<CreateModuleMutation, { modulesCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateModuleMutation,
            CreateModuleMutationVariables,
            { modulesCreate: I_MutationResponse }
        >(this.createModuleGQL, variables, options);
    };

    updateModule = (
        variables?: UpdateModuleMutationVariables,
        options?: I_GraphQLOptions<UpdateModuleMutation, { modulesUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateModuleMutation,
            UpdateModuleMutationVariables,
            { modulesUpdate: I_MutationResponse }
        >(this.updateModuleGQL, variables, options);
    };

    updateModuleStatus = (
        variables?: UpdateModuleStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateModuleStatusMutation, { modulesUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateModuleStatusMutation,
            UpdateModuleStatusMutationVariables,
            { modulesUpdateStatus: I_MutationResponse }
        >(this.updateModuleStatusGQL, variables, options);
    };
    // #endregion

    // #region COURSE
    private normalizeCourseList = (data: GetCoursesQuery, extra?: I_NormalizeExtra): I_TableState<I_Course> => {
        return normalizeWithPagination<I_Course>(data.courses, extra);
    };

    getCourse = (variables?: GetCourseQueryVariables, options?: I_GraphQLOptions<GetCourseQuery, I_Course>) => {
        return this.graphqlService.query<GetCourseQuery, GetCourseQueryVariables, I_Course>(
            this.getCourseGQL,
            variables,
            {
                normalize: (data) => data.course,
                ...options,
            },
        ) as Promise<I_Course>;
    };

    getCourses = (
        variables?: GetCoursesQueryVariables,
        options?: I_GraphQLOptions<GetCoursesQuery, I_TableState<I_Course>>,
    ) => {
        return this.graphqlService.query<GetCoursesQuery, GetCoursesQueryVariables, I_TableState<I_Course>>(
            this.getCoursesGQL,
            variables,
            {
                normalize: (data) => this.normalizeCourseList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Course>>;
    };

    createCourse = (
        variables?: CreateCourseMutationVariables,
        options?: I_GraphQLOptions<CreateCourseMutation, { coursesCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateCourseMutation,
            CreateCourseMutationVariables,
            { coursesCreate: I_MutationResponse }
        >(this.createCourseGQL, variables, options);
    };

    updateCourse = (
        variables?: UpdateCourseMutationVariables,
        options?: I_GraphQLOptions<UpdateCourseMutation, { coursesUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCourseMutation,
            UpdateCourseMutationVariables,
            { coursesUpdate: I_MutationResponse }
        >(this.updateCourseGQL, variables, options);
    };

    updateCourseStatus = (
        variables?: UpdateCourseStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateCourseStatusMutation, { coursesUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCourseStatusMutation,
            UpdateCourseStatusMutationVariables,
            { coursesUpdateStatus: I_MutationResponse }
        >(this.updateCourseStatusGQL, variables, options);
    };
    // #endregion
}
