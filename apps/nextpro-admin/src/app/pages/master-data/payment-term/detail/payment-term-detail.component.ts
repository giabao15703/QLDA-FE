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
import { E_FieldType, E_Form_Mode, I_PaymentTerm, I_PaymentTermForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_PAYMENT_TERM';

@Component({
    standalone: true,
    selector: 'nextpro-admin-payment-term-detail',
    templateUrl: './payment-term-detail.component.html',
    styleUrl: './payment-term-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class PaymentTermDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_PaymentTermForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.nameEn',
                name: 'nameEn',
            },
            {
                label: 'masterData.nameVi',
                name: 'nameVi',
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
    @Input() data: I_PaymentTerm;
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
                const paymentTermDetail = this.data;

                this.form.patchValue({
                    nameEn: translateData(paymentTermDetail, 'en', 'name'),
                    nameVi: translateData(paymentTermDetail, 'vi', 'name'),
                    status: paymentTermDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
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
                const { paymentTermCreate } = await this.masterDataService.createPaymentTerm({
                    ...variables,
                });

                if (paymentTermCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(paymentTermCreate.error?.message);
                }
            } else {
                const { paymentTermUpdate } = await this.masterDataService.updatePaymentTerm({
                    id: this.data.id,
                    ...variables,
                });

                if (paymentTermUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(paymentTermUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
