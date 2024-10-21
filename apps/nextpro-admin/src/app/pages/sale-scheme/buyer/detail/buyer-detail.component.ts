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
import { E_FieldType, E_Form_Mode, I_ProfileFeaturesBuyer, I_ProfileFeaturesBuyerForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_SALE_SCHEME_BUYER';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-buyer-detail',
    templateUrl: './buyer-detail.component.html',
    styleUrl: './buyer-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class BuyerDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_ProfileFeaturesBuyerForm>,
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
                label: 'saleSchemeData.marketResearch',
                name: 'marketResearch',
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
                label: 'saleSchemeData.rfxYear',
                name: 'rfxYear',
            },
            {
                label: 'saleSchemeData.noEAuctionsYear',
                name: 'noEauctionYear',
            },
            {
                label: 'saleSchemeData.helpdesk',
                name: 'helpDesk',
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
                label: 'saleSchemeData.reportYear',
                name: 'reportYear',
            },
            {
                label: 'saleSchemeData.feeEAuction',
                name: 'feeEauction',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.totalFeeYear',
                name: 'totalFeeYear',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.subUserAccounts',
                name: 'subUserAccounts',
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_ProfileFeaturesBuyer;
    @Input() onCloseDrawer;
    @Input() refetch;

    profileFeaturesType;
    status;
    rfxAutoNego;

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    ngOnChanges(changes) {
        if (changes?.mode?.currentValue !== E_Form_Mode.CREATE) {
            if (this.data) {
                const buyerDetail = this.data;

                this.form.patchValue({
                    name: buyerDetail.name,
                    marketResearch: buyerDetail.marketResearch,
                    rfxYear: buyerDetail.rfxYear,
                    noEauctionYear: buyerDetail.noEauctionYear,
                    helpDesk: buyerDetail.helpDesk,
                    reportYear: buyerDetail.reportYear,
                    subUserAccounts: buyerDetail.subUserAccounts,
                    feeEauction: buyerDetail.feeEauction,
                    totalFeeYear: buyerDetail.totalFeeYear,
                });

                this.profileFeaturesType = buyerDetail.profileFeaturesType;
                this.status = buyerDetail.status;
                this.rfxAutoNego = buyerDetail.rfxAutoNego;
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    name: values.name,
                    marketResearch: values.marketResearch,
                    rfxYear: parseInt(values.rfxYear),
                    noEauctionYear: parseInt(values.noEauctionYear),
                    helpDesk: values.helpDesk,
                    reportYear: parseInt(values.reportYear),
                    subUserAccounts: parseInt(values.subUserAccounts),
                    feeEauction: parseFloat(values.feeEauction),
                    totalFeeYear: parseFloat(values.totalFeeYear),
                    profileFeaturesType: this.profileFeaturesType,
                    status: this.status,
                    rfxAutoNego: this.rfxAutoNego,
                },
            };

            if (this.mode === E_Form_Mode.UPDATE) {
                const { profileFeaturesBuyerUpdate } = await this.saleSchemeService.updateProfileFeaturesBuyer({
                    id: this.data.id,
                    ...variables,
                });

                if (profileFeaturesBuyerUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(profileFeaturesBuyerUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
