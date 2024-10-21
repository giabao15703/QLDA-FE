import { Injectable } from '@angular/core';
import { Apollo, Mutation, Query } from 'apollo-angular';
import { getOperationAST } from 'graphql';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { LoadingService, NotificationService } from '#shared/services';
import { I_GraphQLOptions, T_Any, T_NormalizableGraphQLData } from '#shared/types';

@Injectable({
    providedIn: 'root',
})
export class GraphqlService {
    public errorSubject = new BehaviorSubject<string>(null);
    public error = this.errorSubject.asObservable();

    constructor(
        private apollo: Apollo,
        private notificationService: NotificationService,
        private loadingService: LoadingService,
    ) {}

    private async handleError(error: Error, options?: I_GraphQLOptions<T_Any, T_Any>): Promise<void> {
        this.errorSubject.next(error.message);

        if (options?.toast ?? true) {
            this.notificationService.error(error.message);
        }
    }

    public async query<Q, V, D>(
        instance: Query<Q, V>,
        variables?: V,
        options?: I_GraphQLOptions<Q, D>,
    ): Promise<T_NormalizableGraphQLData<Q, D>> {
        const operation = getOperationAST(instance.document);
        const operationName = operation?.name?.value;

        this.loadingService.show(operationName, options?.loading);

        try {
            const result = await firstValueFrom(
                instance.watch(variables, {
                    fetchPolicy: 'network-only',
                    ...options?.graphql,
                }).valueChanges,
            );

            return options?.normalize ? options.normalize(result.data) : result.data;
        } catch (error) {
            await this.handleError(error as Error, options);
            throw error;
        } finally {
            this.loadingService.hide(operationName, options?.loading);
        }
    }

    public async mutate<M, V, D = M>(
        instance: Mutation<M, V>,
        variables?: V,
        options?: I_GraphQLOptions<M, D>,
    ): Promise<T_NormalizableGraphQLData<M, D>> {
        const operation = getOperationAST(instance.document);
        const operationName = operation?.name?.value;

        this.loadingService.show(operationName, options?.loading);

        try {
            const result = await firstValueFrom(
                instance.mutate(variables, {
                    fetchPolicy: 'network-only',
                    context: {
                        useMultipart: true,
                    },
                    ...options?.graphql,
                }),
            );

            return options?.normalize ? options.normalize(result.data) : result.data;
        } catch (error) {
            await this.handleError(error as Error, options);
            throw error;
        } finally {
            this.loadingService.hide(operationName, options?.loading);
        }
    }

    public setError(error: string): void {
        this.errorSubject.next(error);
    }

    public resetStore(): void {
        this.apollo.client.resetStore();
    }
}
