import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { MaterialModules } from '#shared/modules';

@Component({
    standalone: true,
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    imports: [CommonModule, MaterialModules],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA)
        public data: {
            message: string;
            type: 'success' | 'error' | 'warn';
        },
        private snackBarRef: MatSnackBarRef<NotificationComponent>,
    ) {}

    closeSnackbar(): void {
        this.snackBarRef.dismiss();
    }
}
