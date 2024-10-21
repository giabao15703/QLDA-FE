import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { T_Any } from '#shared/types';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root',
})
export class RestApiService {
    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private notificationService: NotificationService,
    ) {}

    // GET request
    get(endpoint: string, options?: T_Any): Promise<T_Any> {
        this.loadingService.show(endpoint);

        return firstValueFrom(
            this.http.get(endpoint, options ?? this.httpOptions).pipe(catchError(this.handleError('getData', []))),
        ).finally(() => {
            this.loadingService.hide(endpoint);
        });
    }

    // POST request
    post(endpoint: string, data: T_Any, options?: T_Any): Promise<T_Any> {
        this.loadingService.show(endpoint);

        return firstValueFrom(
            this.http
                .post(endpoint, data, options ?? this.httpOptions)
                .pipe(catchError(this.handleError('postData', data))),
        ).finally(() => {
            this.loadingService.hide(endpoint);
        });
    }

    // PUT request
    put(endpoint: string, data: T_Any, options?: T_Any): Promise<T_Any> {
        this.loadingService.show(endpoint);

        return firstValueFrom(
            this.http
                .put(endpoint, data, options ?? this.httpOptions)
                .pipe(catchError(this.handleError('updateData', data))),
        ).finally(() => {
            this.loadingService.hide(endpoint);
        });
    }

    // DELETE request
    delete(endpoint: string, options?: T_Any): Promise<T_Any> {
        this.loadingService.show(endpoint);

        return firstValueFrom(
            this.http.delete(endpoint, options ?? this.httpOptions).pipe(catchError(this.handleError('deleteData'))),
        ).finally(() => {
            this.loadingService.hide(endpoint);
        });
    }

    // HTTP Options
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    // Handle errors
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: T_Any): Observable<T> => {
            console.error(`${operation} failed: ${error.message}`);
            this.notificationService.error(JSON.stringify(error.message));
            // TODO: send the error to remote logging infrastructure
            return of(result as T); // Let the app keep running by returning an empty result.
        };
    }
}
