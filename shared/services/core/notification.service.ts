import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { NotificationComponent } from '#shared/components';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
    ) {}

    // Keep the generic show method for flexibility
    private show(message: string, type: 'success' | 'error' | 'warn' = 'success', duration = 4000): void {
        if (!this.snackBar) {
            throw new Error('NotificationService.snackBar not initialized');
        }

        this.snackBar.openFromComponent(NotificationComponent, {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['g-custom-snack-bar'],
            duration,
            data: {
                message: this.translateService.instant(message),
                type,
            },
        });
    }

    success(message: string, duration = 4000): void {
        this.show(message, 'success', duration);
    }

    error(message: string, duration = 4000): void {
        this.show(message, 'error', duration);
    }

    warn(message: string, duration = 4000): void {
        this.show(message, 'warn', duration);
    }
}
