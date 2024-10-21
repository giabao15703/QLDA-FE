import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ProductAdsComponent } from './product-ads/product-ads.component';
import { SetProductsAdComponent } from './set-products-ad/set-products-ad.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-create-advertisement',
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        MaterialModules,
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        TranslateModule,
        FormsModule,
    ],
})
export class CreateAdvertisementComponent {
    selectedAdType: string;

    constructor(
        public form: FormService,
        public dialogRef: MatDialogRef<CreateAdvertisementComponent>,
        public dialog: MatDialog,
    ) {}

    closeDialog() {
        this.dialogRef.close();
    }

    openChildDialog() {
        this.dialogRef.close();
        this.dialogRef.afterClosed().subscribe(() => {
            if (this.selectedAdType === 'product-ad') {
                this.dialog.open(ProductAdsComponent, {
                    width: '1400px',
                    panelClass: 'custom-dialog',
                });
            } else if (this.selectedAdType === 'set-products-ad') {
                this.dialog.open(SetProductsAdComponent, {
                    width: '1400px',
                    panelClass: 'custom-dialog',
                });
            }
        });
    }
}
