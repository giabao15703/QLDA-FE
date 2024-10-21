import { CommonModule } from '@angular/common';
import { Component, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { LoadingComponent } from '#shared/components';
import { LoadingService } from '#shared/services';
// import { getAppConfigProvider } from '@shared/app-config';
// import { TokenInterceptor } from './token-interceptor';

@Component({
    standalone: true,
    selector: 'nextpro-user-root',
    templateUrl: './app.component.html',
    imports: [
        CommonModule,
        RouterModule,
        LoadingComponent,
        // SharedModule,
        // GraphQLModule,
        // NgxPaginationModule,
        // AuctionCopyNewUIModule,
        // MarketResearchModule,
        // LoginModule,
        // I18nModule,
        // InfiniteScrollModule,
        // ContactComponent,
        // NotFoundPage,
        // NavbarComponent,
        // UserGuideComponent,
    ],
    providers: [
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'VND' },
        // {
        // provide: HTTP_INTERCEPTORS,
        // useClass: TokenInterceptor,
        // multi: true,
        // },
        // getAppConfigProvider(environment),
    ],
})
export class AppComponent {
    constructor(
        private loadingService: LoadingService,
        private translateService: TranslateService,
    ) {}

    title = 'nextpro-user';
    language = 'vi';
    isLoading = false;
    isGlobal = false;

    ngOnInit() {
        this.loadingService.subscribe(this);
        this.translateService.setDefaultLang(this.language);
    }

    ngOnDestroy() {
        this.loadingService.unsubscribe();
    }
}
