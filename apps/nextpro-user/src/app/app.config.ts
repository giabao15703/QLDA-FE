import { IMAGE_CONFIG, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeVi from '@angular/common/locales/vi';
import { ApplicationConfig, LOCALE_ID, NgModule, importProvidersFrom } from '@angular/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { vi } from 'date-fns/locale';

import { createGraphqlProviders, tokenProvider } from '#shared/providers';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

registerLocaleData(localeVi);

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes),
        importProvidersFrom(
            BrowserAnimationsModule,
            HttpClientModule,
            NgModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            }),
            GalleryModule,
        ),
        { provide: LOCALE_ID, useValue: 'vi-VN' },
        { provide: MAT_DATE_LOCALE, useValue: vi },
        {
            provide: IMAGE_CONFIG,
            useValue: {
                disableImageSizeWarning: true,
                disableImageLazyLoadWarning: true,
            },
        },
        ...createGraphqlProviders(environment.graphQL),
        ...tokenProvider,
        provideDateFnsAdapter(),
    ],
};
