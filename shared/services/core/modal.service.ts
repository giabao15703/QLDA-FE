import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { ModalComponent } from '#shared/components';
import { T_ModalConfig } from '#shared/types';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(public dialog: MatDialog) {}

    dialogRef: MatDialogRef<ModalComponent>;

    show = (config: T_ModalConfig) => {
        const { modal, ...rest } = config;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = modal.width ?? '90%';
        dialogConfig.minWidth = modal.minWidth ?? '50%';
        dialogConfig.maxWidth = modal.maxWidth ?? '100%';
        dialogConfig.height = modal.height ?? 'auto';
        dialogConfig.minHeight = modal.minHeight ?? 'auto';
        dialogConfig.maxHeight = modal.maxHeight ?? '100%';
        dialogConfig.data = { modal, ...rest };
        this.dialogRef = this.dialog.open(ModalComponent, dialogConfig);
    };

    hide = () => {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    };
}
