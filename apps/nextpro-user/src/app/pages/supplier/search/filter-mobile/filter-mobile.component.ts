import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_FieldType } from '#shared/types';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-filter-mobile',
    templateUrl: './filter-mobile.component.html',
    styleUrl: './filter-mobile.component.scss',
    imports: [CommonModule, MaterialModules, FormComponent, TranslateModule],
})
export class FilterMobileComponent {
    constructor(
        public staffForm: FormService,
        public segmentForm: FormService,
        public industryForm: FormService,
        public paymentForm: FormService,
        public countryForm: FormService,
        public sortForm: FormService,
        private _bottomSheetRef: MatBottomSheetRef<FilterMobileComponent>,
    ) {
        this.staffForm.config = [
            {
                label: 'supplier-listing.filter.staff.title',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.staff.select-quality',
                name: 'quality',
                fieldType: E_FieldType.SELECT,
            },
        ];
        this.segmentForm.config = [
            {
                label: 'supplier-listing.filter.customer-segmentation.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.customer-segmentation.select-segment',
                name: 'segment',
                fieldType: E_FieldType.SELECT,
            },
        ];
        this.industryForm.config = [
            {
                label: 'supplier-listing.filter.supplier-areas-of-interest.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.supplier-areas-of-interest.select-industry',
                name: 'industry',
                fieldType: E_FieldType.SELECT,
            },
        ];
        this.paymentForm.config = [
            {
                label: 'supplier-listing.filter.payment.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.payment.select-payment',
                name: 'payment',
                fieldType: E_FieldType.SELECT,
            },
        ];
        this.countryForm.config = [
            {
                label: 'supplier-listing.filter.country.all',
                name: 'all',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.country.select-country',
                name: 'country',
                fieldType: E_FieldType.SELECT,
            },
        ];
        this.sortForm.config = [
            {
                label: 'supplier-listing.filter.sort-by.supplier-profile-type',
                name: 'profileType',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.sort-by.type-of-profile-verification',
                name: 'verification',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.sort-by.supplier-names-from-A-to-Z',
                name: 'profileName',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.sort-by.viewed',
                name: 'viewed',
                fieldType: E_FieldType.CHECKBOX,
            },
            {
                label: 'supplier-listing.filter.sort-by.followed',
                name: 'followed',
                fieldType: E_FieldType.CHECKBOX,
            },
        ];
    }

    @Input() toggleModal: () => void;

    rate = 3;

    closeBottomSheet(): void {
        this._bottomSheetRef.dismiss();
    }

    onSubmit() {
        this.staffForm.getRawValue();
        this.segmentForm.getRawValue();
        this.industryForm.getRawValue();
        this.paymentForm.getRawValue();
        this.countryForm.getRawValue();
        this.sortForm.getRawValue();
    }

    clearFilters() {
        this.staffForm.reset();
        this.segmentForm.reset();
        this.industryForm.reset();
        this.paymentForm.reset();
        this.countryForm.reset();
        this.sortForm.reset();
    }
}
