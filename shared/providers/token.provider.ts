import {
    HTTP_INTERCEPTORS,
    HttpEvent,
    HttpEventType,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService, LocalStorageService } from '#shared/services';
import { T_Any } from '#shared/types';

@Injectable()
class TokenInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
    ) {}

    intercept(request: HttpRequest<T_Any>, next: HttpHandler): Observable<HttpEvent<T_Any>> {
        if (this.authService.isLoggedIn()) {
            const token = this.localStorageService.get('token');
            const languageCode = this.localStorageService.get('languageCode');

            request = request.clone({
                setHeaders: {
                    ...(token && { Authorization: `Token ${token}` }),
                    'Language-Code': languageCode,
                },
            });
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<T_Any>) => {
                if (
                    event.type === HttpEventType.Response &&
                    event.status === 200 &&
                    event.body &&
                    Array.isArray(event.body.errors) &&
                    event.body.errors[0].message === 'Invalid token'
                ) {
                    this.authService.logout();
                }

                return event;
            }),
            catchError((error) => {
                if (error.status === 401) {
                    this.authService.logout();
                }

                return throwError(() => error);
            }),
        );
    }
}

export const tokenProvider = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true,
    },
];
