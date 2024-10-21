import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_Voucher, I_VoucherForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_Voucher';

@Component({
    standalone: true,
    selector: 'nextpro-admin-voucher-detail',
    templateUrl: './voucher-detail.component.html',
    styleUrl: './voucher-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class VoucherDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_VoucherForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'voucher.code',
                name: 'voucherCode',
            },
            {
                label: 'masterData.descriptionVi',
                name: 'nameVi',
            },
            {
                label: 'masterData.descriptionEn',
                name: 'nameEn',
            },
            {
                label: 'masterData.discount',
                name: 'discount',
            },
            {
                label: 'masterData.label',
                name: 'label',
                fieldType: E_FieldType.UPLOAD,
            },
            {
                label: 'masterData.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'masterData.active',
                        value: true,
                    },
                    {
                        label: 'masterData.inactive',
                        value: false,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Voucher;
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
                const voucherDetail = this.data;

                this.form.patchValue({
                    nameEn: translateData(voucherDetail, 'en', 'name'),
                    nameVi: translateData(voucherDetail, 'vi', 'name'),
                    discount: voucherDetail.discount,
                    label: voucherDetail.label,
                    voucherCode: voucherDetail.voucherCode,
                    status: voucherDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    discount: values.discount,
                    label: values.label,
                    voucherCode: values.voucherCode,
                    status: values.status,
                },
            };

            if (values.nameEn) {
                variables.input.names.push({ name: values.nameEn, languageCode: 'en' });
            }

            if (values.nameVi) {
                variables.input.names.push({ name: values.nameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { voucherCreate } = await this.masterDataService.createVoucher({
                    ...variables,
                });

                if (voucherCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(voucherCreate.error?.message);
                }
            } else {
                const { voucherUpdate } = await this.masterDataService.updateVoucher({
                    id: this.data.id,
                    ...variables,
                });

                if (voucherUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(voucherUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
