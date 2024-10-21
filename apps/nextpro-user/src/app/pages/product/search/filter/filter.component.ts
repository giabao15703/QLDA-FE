import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService, MasterDataService } from '#shared/services';
import { E_FieldType, I_Country } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-user-filter',
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    providers: [FormService],
    imports: [CommonModule, MaterialModules, FormComponent, TranslateModule],
})
export class ProductListFilterComponent {
    constructor(
        public originForm: FormService,
        public paymentForm: FormService,
        public transportForm: FormService,
        public warrantyForm: FormService,
        public ratingForm: FormService,
        private masterDataService: MasterDataService,
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
                loadingName: 'getCountries',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.masterDataService.getCountries().then((res) => res.data),
                mapOption: (item: I_Country) => ({
                    label: item.name,
                    value: item.id,
                }),
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

    @Input() toggleModal: () => void;

    rate = 3;

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
