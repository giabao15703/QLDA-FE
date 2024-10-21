import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetBanksGQL, GetBanksQuery, GetBanksQueryVariables } from '#shared/graphql/types';
import { I_Bank } from '#shared/types';
import { GraphqlService } from './core/graphql.service';

@Injectable({
    providedIn: 'root',
})
export class BankService {
    constructor(
        private graphqlService: GraphqlService,
        private getBanksGQL: GetBanksGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }
    private normalize = (data: GetBanksQuery): I_Bank[] => {
        return data.banks.edges.map((banner) => banner.node);
    };

    getBanks = (variables?: GetBanksQueryVariables) => {
        return this.graphqlService.query<GetBanksQuery, GetBanksQueryVariables, I_Bank[]>(this.getBanksGQL, variables, {
            normalize: this.normalize,
        }) as Promise<I_Bank[]>;
    };
}
