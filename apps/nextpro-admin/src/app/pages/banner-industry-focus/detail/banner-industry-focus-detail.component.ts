import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    CouponDataService,
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
} from '#shared/services';
import { E_FieldAppearance, E_FieldType, E_Form_Mode, I_Coupon, I_CouponForm } from '#shared/types';
import { formatDate } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_COUPON';

@Component({
    standalone: true,
    selector: 'nextpro-admin-banner-industry-focus-detail',
    templateUrl: './banner-industry-focus-detail.component.html',
    styleUrl: './banner-industry-focus-detail.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        TranslateModule,
        LoadingComponent,
        MaterialModules,
        TableComponent,
        FormComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class BannerIndustryFocusDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_CouponForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private couponDataService: CouponDataService,
    ) {
        this.form.config = [
            {
                label: 'bannerIndustryFocus.selectedCategoryCode',
                name: 'selectedCategoryCode',
            },
            {
                label: 'bannerIndustryFocus.selectedCategoryName',
                name: 'selectedCategoryName',
            },
            {
                label: 'bannerIndustryFocus.effectiveDateFrom',
                name: 'effectiveDateFrom',
                fieldType: E_FieldType.DATEPICKER,
                appearance: E_FieldAppearance.OUTLINE,
            },
            {
                label: 'bannerIndustryFocus.effectiveDateTo',
                name: 'effectiveDateTo',
                fieldType: E_FieldType.DATEPICKER,
                appearance: E_FieldAppearance.OUTLINE,
            },
            {
                label: 'bannerIndustryFocus.banner',
                name: 'banner',
                fieldType: E_FieldType.UPLOAD,
                showPreview: true,
            },
            {
                label: 'voucher.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'voucher.active',
                        value: true,
                    },
                    {
                        label: 'voucher.inactive',
                        value: false,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Coupon;
    @Input() onCloseDrawer;
    @Input() refetch;

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    ngOnChanges(changes) {
        if (changes?.mode?.currentValue === E_Form_Mode.CREATE) {
            this.form.reset();
        } else {
            if (this.data) {
                const couponDetail = this.data;

                this.form.patchValue({
                    couponProgram: couponDetail.couponProgram,
                    description: couponDetail.description,
                    commission: couponDetail.commission.toString(),
                    validFrom: couponDetail.validFrom,
                    validTo: couponDetail.validTo,
                    note: couponDetail.note,
                    fullName: couponDetail.fullName,
                    email: couponDetail.email,
                    status: couponDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                couponProgram: values.couponProgram,
                description: values.description,
                commission: parseInt(values.commission),
                validFrom: formatDate(values.validFrom, { format: 'YYYY-MM-DD' }),
                validTo: formatDate(values.validTo, { format: 'YYYY-MM-DD' }),
                email: values.email,
                fullName: values.fullName,
                note: values.note,
                status: values.status,
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { couponCreate } = await this.couponDataService.createCoupon({
                    coupon: variables,
                });

                if (couponCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(couponCreate.error?.message);
                }
            } else {
                const { couponUpdate } = await this.couponDataService.updateCoupon({
                    id: this.data.id,
                    input: variables,
                });

                if (couponUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(couponUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
