import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_FieldType } from '#shared/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-filter-mobile',
    templateUrl: './filter-mobile.component.html',
    styleUrl: './filter-mobile.component.scss',
    providers: [FormService],
    imports: [CommonModule, MaterialModules, FormComponent, TranslateModule],
})
export class FilterMobileComponent {
    constructor(
        private _bottomSheetRef: MatBottomSheetRef<FilterMobileComponent>,
        public originForm: FormService,
        public paymentForm: FormService,
        public transportForm: FormService,
        public warrantyForm: FormService,
        public ratingForm: FormService,
    ) {
        this.originForm.config = [
            {
                label: 'products-listing.filter.made-in.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'products-listing.filter.made-in.select-country',
                name: 'country',
                options: [
                    {
                        label: 'Việt Nam',
                        value: 'VN',
                    },
                    {
                        label: 'Trung Quốc',
                        value: 'TQ',
                    },
                    {
                        label: 'Hàn Quốc',
                        value: 'HQ',
                    },
                    {
                        label: 'Mỹ',
                        value: 'US',
                    },
                    {
                        label: 'Nhật Bản',
                        value: 'JP',
                    },
                ],
                fieldType: E_FieldType.SELECT,
            },
        ];
        this.paymentForm.config = [
            {
                label: 'products-listing.filter.payment.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'products-listing.filter.payment.payment-protection',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'products-listing.filter.payment.pay-directly-to-the-supplier',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'products-listing.filter.payment.payment-upon-delivery',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
        ];
        this.transportForm.config = [
            {
                label: 'products-listing.filter.transport.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'products-listing.filter.transport.economical-shipping',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'products-listing.filter.transport.free-shipping',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'products-listing.filter.transport.supplier-and-buyer-agreements',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
        ];
        this.warrantyForm.config = [
            {
                label: 'products-listing.filter.warranty.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'products-listing.filter.warranty.select-time',
                name: 'dateTime',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: '6 tháng', value: 1 },
                    { label: '12 tháng', value: 2 },
                    { label: '3 năm', value: 3 },
                ],
            },
        ];
        this.ratingForm.config = [
            {
                label: 'products-listing.filter.rating.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
                disabled: true,
            },
            {
                name: 'rating',
                fieldType: E_FieldType.RATING,
                suffix: { text: 'products-listing.filter.rating.above' },
            },
        ];
    }

    closeBottomSheet(): void {
        this._bottomSheetRef.dismiss();
    }

    onSubmit() {
        this.originForm.getRawValue();
        this.paymentForm.getRawValue();
        this.transportForm.getRawValue();
        this.warrantyForm.getRawValue();
        this.ratingForm.getRawValue();
    }

    clearFilters() {
        this.originForm.reset();
        this.paymentForm.reset();
        this.transportForm.reset();
        this.warrantyForm.reset();
        this.ratingForm.reset();
    }
}
