import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_ContainerType, E_FieldType } from '#shared/types';
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
import { FormComponent } from '../../../../../form/form.component';
@Component({
    standalone: true,
    selector: 'nextpro-user-create-product-ads',
    templateUrl: './product-ads.component.html',
    styleUrls: ['./product-ads.component.scss'],
    providers: [FormService],
    imports: [
        MaterialModules,
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        TranslateModule,
        FormComponent,
    ],
})
export class ProductAdsComponent {
    constructor(
        public form: FormService,
        public dialogRef: MatDialogRef<ProductAdsComponent>,
    ) {
        this.form.config = [
            {
                name: 'bannerAdContainer',
                fieldType: E_FieldType.DYNAMIC,
                class: 'flex flex-col gap-2',
                rowClass: 'mt-3 grid gap-2 grid-cols-1 lg:grid-cols-5 border-b-2 border-[#1e6d84]',
                maxLength: 3,
                createButton: {
                    text: 'Add row',
                },
                children: [
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.product',
                        name: 'product',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.product-ads.status',
                        name: 'status',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.product-ads.duration',
                        name: 'duration',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.product-ads.validFrom',
                        name: 'startDate',
                        fieldType: E_FieldType.DATEPICKER,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.product-ads.validTo',
                        name: 'endDate',
                        fieldType: E_FieldType.DATEPICKER,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.product-ads.advertising-costs',
                        name: 'advertisingCosts',
                    },
                ],
            },
            {
                name: 'advertisingCostsContainer',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.title',
                children: [
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.price',
                        name: 'price',
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.discount-code',
                        name: 'discountCode',
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.amount',
                        name: 'amount',
                    },
                    {
                        fieldType: E_FieldType.TEXT,
                        value: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.note',
                        class: 'my-3 text-sm',
                    },
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'advertisingCosts',
                        table: {
                            class: '!h-auto my-5',
                            data: [
                                {
                                    discountProgram: 'NEWUPGRADE',
                                    description: 'Nâng cấp tính năng Gói hồ sơ nhà cung cấp',
                                    discount: '10%',
                                    effectiveFrom: '01/01/2021',
                                    effectiveTo: '01/01/2022',
                                },
                            ],
                            columns: [
                                {
                                    name: 'discountProgram',
                                    label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.discount-program',
                                },
                                {
                                    name: 'description',
                                    label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.description',
                                    headerStyle: { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' },
                                },
                                {
                                    name: 'discount',
                                    label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.discount',
                                    headerStyle: { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' },
                                },
                                {
                                    name: 'validFrom',
                                    label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.validFrom',
                                    headerStyle: { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' },
                                },
                                {
                                    name: 'validTo',
                                    label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.validTo',
                                    headerStyle: { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' },
                                },
                            ],
                        },
                    },
                ],
            },
        ];
    }

    closeDialog() {
        this.dialogRef.close();
    }

    handleConfirm = () => {
        this.form.submit((values) => {
            console.log('values', values);
        });
    };
}
