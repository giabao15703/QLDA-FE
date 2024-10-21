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
    selector: 'nextpro-user-create-set-products-ad',
    templateUrl: './set-products-ad.component.html',
    styleUrls: ['./set-products-ad.component.scss'],
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
export class SetProductsAdComponent {
    constructor(
        public form: FormService,
        public dialogRef: MatDialogRef<SetProductsAdComponent>,
    ) {
        this.form.config = [
            {
                name: 'bannerAdContainer',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                class: 'grid gap-2 grid-cols-1 lg:grid-cols-3',
                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.title',
                children: [
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.main-banner',
                        name: 'mainBanner',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.product-set-name-1',
                        name: 'productSetName2',
                        maxLength: 30,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.product-set-name-2',
                        name: 'productSetName2',
                        maxLength: 30,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.duration',
                        name: 'duration',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.start-date',
                        name: 'startDate',
                        fieldType: E_FieldType.DATEPICKER,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.end-date',
                        name: 'endDate',
                        fieldType: E_FieldType.DATEPICKER,
                    },
                    {
                        fieldType: E_FieldType.TEXT,
                        value: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.note',
                        class: 'text-sm',
                    },
                ],
            },
            {
                name: 'productSetDetailsContainer',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.DIV,
                class: 'text-lg text-black font-semibold mt-5',
                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.title',
                children: [
                    {
                        name: 'productSetDetails',
                        fieldType: E_FieldType.DYNAMIC,
                        containerType: E_ContainerType.DIV,
                        class: 'flex flex-col gap-2',
                        rowClass: 'mt-3 grid gap-2 grid-cols-1 lg:grid-cols-5 border-b-2 border-[#1e6d84]',
                        maxLength: 3,
                        createButton: {
                            text: 'Add row',
                        },
                        children: [
                            {
                                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.banner-image',
                                name: 'banner',
                                fieldType: E_FieldType.UPLOAD,
                                uploadType: 'single',
                            },
                            {
                                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.background',
                                name: 'background',
                            },
                            {
                                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.product',
                                name: 'product-1',
                                fieldType: E_FieldType.SELECT,
                            },
                            {
                                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.product',
                                name: 'product-2',
                                fieldType: E_FieldType.SELECT,
                            },
                            {
                                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.product',
                                name: 'product-3',
                                fieldType: E_FieldType.SELECT,
                            },
                            {
                                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.product',
                                name: 'product-4',
                                fieldType: E_FieldType.SELECT,
                            },
                        ],
                    },
                    {
                        fieldType: E_FieldType.TEXT,
                        value: 'supplier-profile.tabs.advertisement.create.set-products-ad.product-set-detail.note',
                        class: 'text-sm text-[#666666] font-normal',
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
                                    name: 'effectiveFrom',
                                    label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-costs.validFrom',
                                    headerStyle: { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' },
                                },
                                {
                                    name: 'effectiveTo',
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
}
