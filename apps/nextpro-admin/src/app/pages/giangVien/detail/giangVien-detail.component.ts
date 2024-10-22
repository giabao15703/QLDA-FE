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
    GiangVienService,
    LoadingService,
    LocalStorageService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_Coupon, I_GiangVien } from '#shared/types';
import { formatDate } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_COUPON';

@Component({
    standalone: true,
    selector: 'nextpro-admin-giangVien-detail',
    templateUrl: './giangVien-detail.component.html',
    styleUrl: './giangVien-detail.component.scss',
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
export class GiangVienDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_GiangVien>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private giangVienService: GiangVienService,
    ) {
        this.form.config = [
            {
                label: 'Tên',
                name: 'name',
            },
            {
                label: 'Đề tài',
                name: 'deTai',
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_GiangVien;
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
                const GiangVienDetail = this.data;

                this.form.patchValue({
                    name: GiangVienDetail.name,
                    deTai: GiangVienDetail.deTai || '',
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    name: values.name,
                    deTai: values.deTai,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { giangVienCreate } = await this.giangVienService.createGiangVien({
                    ...variables,
                });

                if (giangVienCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(giangVienCreate.error?.message);
                }
            } /* else {
                const { couponUpdate } = await this.giangVienService.updateCoupon({
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
            } */

            this.refetch();
        }, FORM_NAME);
    };
}
