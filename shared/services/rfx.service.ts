import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    GetRfxesGQL,
    GetRfxesQuery,
    GetRfxesQueryVariables,
    GetRfxGQL,
    GetRfxQuery,
    GetRfxQueryVariables,
} from '#shared/graphql/types';
import { I_GraphQLOptions, I_NormalizeExtra, I_Rfx, I_TableState } from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class RfxService {
    constructor(
        private graphqlService: GraphqlService,
        private getRfxGQL: GetRfxGQL,
        private getRfxesGQL: GetRfxesGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalizeRfxList = (data: GetRfxesQuery, extra?: I_NormalizeExtra): I_TableState<I_Rfx> => {
        return normalizeWithPagination<I_Rfx>(data.rfxes, extra);
    };

    getRfx = (variables?: GetRfxQueryVariables, options?: I_GraphQLOptions<GetRfxQuery, I_Rfx>) => {
        return this.graphqlService.query<GetRfxQuery, GetRfxQueryVariables, I_Rfx>(this.getRfxGQL, variables, {
            normalize: (data) => data.rfx,
            ...options,
        }) as Promise<I_Rfx>;
    };

    getRfxes = (variables?: GetRfxesQueryVariables, options?: I_GraphQLOptions<GetRfxesQuery, I_TableState<I_Rfx>>) => {
        return this.graphqlService.query<GetRfxesQuery, GetRfxesQueryVariables, I_TableState<I_Rfx>>(
            this.getRfxesGQL,
            variables,
            {
                normalize: (data) => this.normalizeRfxList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Rfx>>;
    };
}
