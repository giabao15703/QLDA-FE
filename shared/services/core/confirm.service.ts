import { ConfirmComponent } from '#shared/components';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {
    constructor(private dialog: MatDialog) {}

    open(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '300px',
            data: { title, message },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                onConfirm();
            } else {
                if (onCancel && typeof onCancel === 'function') {
                    onCancel();
                }
            }
        });
    }
}
