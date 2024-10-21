import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CheckValidReferralCodeGQL,
    CheckValidReferralCodeQuery,
    CheckValidReferralCodeQueryVariables,
} from '#shared/graphql/types';
import { GraphqlService } from '#shared/services';

@Injectable({
    providedIn: 'root',
})
export class PromotionService {
    constructor(
        private graphqlService: GraphqlService,
        private checkValidReferralCodeGQL: CheckValidReferralCodeGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    checkValidReferral = (variables?: CheckValidReferralCodeQueryVariables) => {
        return this.graphqlService.query<CheckValidReferralCodeQuery, CheckValidReferralCodeQueryVariables, boolean>(
            this.checkValidReferralCodeGQL,
            variables,
            {
                normalize: (data) => {
                    return data.promotions.totalCount > 0;
                },
                // toast: false,
                // loading: E_LoadingType.LOCAL,
            },
        ) as Promise<boolean>;
    };
}
