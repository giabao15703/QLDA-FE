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
import { E_FieldType, E_Form_Mode, I_ProfileFeaturesSupplier, I_ProfileFeaturesSupplierForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_SALE_SCHEME_SUPPLIER_PROFILE_FEATURE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-supplier-profile-feature-detail',
    templateUrl: './profile-feature-detail.component.html',
    styleUrl: './profile-feature-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class SaleSchemeSupplierProfileFeatureDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_ProfileFeaturesSupplierForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private saleSchemeService: SaleSchemeService,
    ) {
        this.form.config = [
            {
                label: 'account.supplier-accounts.detail-supplier-account.upgrade-profile.name',
                name: 'name',
            },
            {
                label: 'saleSchemeData.freeRegistration',
                name: 'freeRegistration',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'YES',
                        value: 'Yes',
                    },
                    {
                        label: 'NO',
                        value: 'No',
                    },
                ],
            },
            {
                label: 'saleSchemeData.quoteSubmiting',
                name: 'quoteSubmiting',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'YES',
                        value: 'Yes',
                    },
                    {
                        label: 'NO',
                        value: 'No',
                    },
                ],
            },

            {
                label: 'saleSchemeData.rfxReceivingPriority',
                name: 'rfxrReceivingPriority',
            },

            {
                label: 'saleSchemeData.subUserAccounts',
                name: 'subUserAccounts',
            },

            {
                label: 'saleSchemeData.helpdesk',
                name: 'helpDesk',
            },
            {
                label: 'saleSchemeData.featuredProducts',
                name: 'flashSale',
            },
            {
                label: 'saleSchemeData.product',
                name: 'product',
            },
            {
                label: 'saleSchemeData.reportYear',
                name: 'reportYear',
            },
            {
                label: 'saleSchemeData.baseRateMonth',
                name: 'baseRateMonth',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.baseRateYear',
                name: 'baseRateFullYear',
                suffix: { text: 'VNĐ' },
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_ProfileFeaturesSupplier;
    @Input() onCloseDrawer;
    @Input() refetch;

    profileFeaturesType;
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
                const profileFeatureDetail = this.data;

                this.form.patchValue({
                    name: profileFeatureDetail.name,
                    freeRegistration: profileFeatureDetail.freeRegistration,
                    quoteSubmiting: profileFeatureDetail.quoteSubmiting,
                    rfxrReceivingPriority: profileFeatureDetail.rfxrReceivingPriority,
                    subUserAccounts: profileFeatureDetail.subUserAccounts,
                    helpDesk: profileFeatureDetail.helpDesk,
                    flashSale: profileFeatureDetail.flashSale,
                    product: profileFeatureDetail.product,
                    reportYear: profileFeatureDetail.reportYear,
                    baseRateMonth: profileFeatureDetail.baseRateMonth,
                    baseRateFullYear: profileFeatureDetail.baseRateFullYear,
                });

                this.profileFeaturesType = profileFeatureDetail.profileFeaturesType;
                this.status = profileFeatureDetail.status;
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    name: values.name,
                    freeRegistration: values.freeRegistration,
                    quoteSubmiting: values.quoteSubmiting,
                    rfxrReceivingPriority: parseInt(values.rfxrReceivingPriority),
                    subUserAccounts: parseInt(values.subUserAccounts),
                    helpDesk: values.helpDesk,
                    flashSale: parseInt(values.flashSale),
                    reportYear: parseInt(values.reportYear),
                    baseRateMonth: parseFloat(values.baseRateMonth),
                    baseRateFullYear: parseFloat(values.baseRateFullYear),
                    profileFeaturesType: this.profileFeaturesType,
                    status: this.status,
                    product: parseInt(values.product),
                },
            };

            if (this.mode === E_Form_Mode.UPDATE) {
                const { profileFeaturesSupplierUpdate } = await this.saleSchemeService.updateProfileFeaturesSupplier({
                    id: this.data.id,
                    ...variables,
                });

                if (profileFeaturesSupplierUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(profileFeaturesSupplierUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
