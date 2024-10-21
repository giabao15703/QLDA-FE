import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, NotificationService } from '#shared/services';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(
        private router: Router,
        private authService: AuthService,
        private notificationService: NotificationService,
    ) {}

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.authService.isLoggedIn()) {
            this.notificationService.warn('Please Log In!');
            this.router.navigate(['/auth/login']);

            return false;
        }

        return true;
    }
}
