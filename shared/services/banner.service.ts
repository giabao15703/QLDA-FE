import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetBannerListGQL, GetBannerListQuery, GetBannerListQueryVariables } from '#shared/graphql/types';
import { GraphqlService } from '#shared/services';
import { I_Banner } from '#shared/types';

@Injectable({
    providedIn: 'root',
})
export class BannerService {
    constructor(
        private graphqlService: GraphqlService,
        private getBannerListGQL: GetBannerListGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    private normalize = (data: GetBannerListQuery): I_Banner[] => {
        return data.bannerList.edges.map((banner) => banner.node);
    };

    getBannerList = (variables?: GetBannerListQueryVariables) => {
        return this.graphqlService.query<GetBannerListQuery, GetBannerListQueryVariables, I_Banner[]>(
            this.getBannerListGQL,
            variables,
            {
                normalize: this.normalize,
            },
        ) as Promise<I_Banner[]>;
    };
}
