import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    SaleSchemeService,
} from '#shared/services';
import { E_Form_Mode, I_SicpRegistration, I_SicpRegistrationForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_SALE_SCHEME_SUPPLIER_SICP';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-supplier-sicp-detail',
    templateUrl: './sicp-detail.component.html',
    styleUrl: './sicp-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class SaleSchemeSupplierSicpRegistrationDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_SicpRegistrationForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private saleSchemeService: SaleSchemeService,
    ) {
        this.form.config = [
            {
                label: 'saleSchemeData.name',
                name: 'name',
            },
            {
                label: 'saleSchemeData.legalStatus',
                name: 'legalStatus',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.bankAccount',
                name: 'bankAccount',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.sanctionCheck',
                name: 'sanctionCheck',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.certificateManagement',
                name: 'certificateManagement',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.dueDiligence',
                name: 'dueDiligence',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.financialRisk',
                name: 'financialRisk',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.totalAmount',
                name: 'totalAmount',
                suffix: { text: 'VNĐ' },
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_SicpRegistration;
    @Input() onCloseDrawer;
    @Input() refetch;

    sicpType;
    status;

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    ngOnChanges(changes) {
        if (changes?.mode?.currentValue !== E_Form_Mode.CREATE) {
            if (this.data) {
                const sicpRegistrationDetail = this.data;

                this.form.patchValue({
                    name: sicpRegistrationDetail.name,
                    legalStatus: sicpRegistrationDetail.legalStatus,
                    bankAccount: sicpRegistrationDetail.bankAccount,
                    sanctionCheck: sicpRegistrationDetail.sanctionCheck,
                    certificateManagement: sicpRegistrationDetail.certificateManagement,
                    dueDiligence: sicpRegistrationDetail.dueDiligence,
                    financialRisk: sicpRegistrationDetail.financialRisk,
                    totalAmount: sicpRegistrationDetail.totalAmount,
                });

                this.sicpType = sicpRegistrationDetail.sicpType;
                this.status = sicpRegistrationDetail.status;
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    name: values.name,
                    legalStatus: parseFloat(values.legalStatus),
                    bankAccount: parseFloat(values.bankAccount),
                    sanctionCheck: parseFloat(values.sanctionCheck),
                    certificateManagement: parseFloat(values.certificateManagement),
                    dueDiligence: parseFloat(values.dueDiligence),
                    financialRisk: parseFloat(values.financialRisk),
                    totalAmount: parseFloat(values.totalAmount),
                    sicpType: this.sicpType,
                    status: this.status,
                },
            };

            if (this.mode === E_Form_Mode.UPDATE) {
                const { sicpRegistrationUpdate } = await this.saleSchemeService.updateSicpRegistration({
                    id: this.data.id,
                    ...variables,
                });

                if (sicpRegistrationUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(sicpRegistrationUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
