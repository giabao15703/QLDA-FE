import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_FieldType } from '#shared/types';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { QuantitySelectorComponent } from '../quantity-selector/quantity-selector.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-buy-now',
    templateUrl: './buy-now.component.html',
    styleUrl: './buy-now.component.scss',
    providers: [FormService],
    imports: [
        MaterialModules,
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        QuantitySelectorComponent,
        FormComponent,
        TranslateModule,
    ],
})
export class BuyNowComponent {
    constructor(
        public form: FormService,
        public dialogRef: MatDialogRef<BuyNowComponent>,
    ) {
        this.form.config = [
            {
                name: 'nottForSuppliers',
                class: 'mt-2 w-full',
                fieldType: E_FieldType.TEXTAREA,
            },
        ];
    }

    quantity: number = 1;
    unitPrice: number = 100000;
    buyNow = [
        {
            id: 1,
            minQuantity: 10,
            orderQuantity: 10,
            price: 6000000,
            transportFee: 30000,
            voucher: -20000,
            buyerClub: -50000,
            repay: -100000,
            totalPrice: 600000,
            deliveryTime: '7 ngày',
            deliveryDate: '30/04/2024',
        },
    ];

    get totalPrice() {
        return this.quantity * this.unitPrice;
    }

    closeDialog() {
        this.dialogRef.close();
    }

    confirmPurchase() {
        console.log('Purchase confirmed:', this.quantity);
        this.dialogRef.close();
    }
}
