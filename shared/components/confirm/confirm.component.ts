import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';

@Component({
    standalone: true,
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
    imports: [TranslateModule, MaterialModules],
})
export class ConfirmComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    ) {}

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
