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
import { E_Form_Mode, I_UserDiamondSponsorFee, I_UserDiamondSponsorFeeForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_SALE_SCHEME_SPONSOR_FEE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-sponsor-fee-detail',
    templateUrl: './sponsor-fee-detail.component.html',
    styleUrl: './sponsor-fee-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class SaleSchemeSupplierSponsorFeeDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_UserDiamondSponsorFeeForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private saleSchemeData: SaleSchemeService,
    ) {
        this.form.config = [
            {
                label: 'saleSchemeData.title',
                name: 'title',
            },
            {
                label: 'saleSchemeData.amount',
                name: 'fee',
                suffix: { text: 'VNĐ' },
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_UserDiamondSponsorFee;
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
                const userDiamondSponsorFeeDetail = this.data;

                this.form.patchValue({
                    title: userDiamondSponsorFeeDetail.title,
                    fee: userDiamondSponsorFeeDetail.fee,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                title: values.title,
                fee: parseFloat(values.fee),
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { userDiamondSponsorFeeCreate } = await this.saleSchemeData.createUserDiamondSponsorFee({
                    input: variables,
                });

                if (userDiamondSponsorFeeCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(userDiamondSponsorFeeCreate.error?.message);
                }
            } else {
                const { userDiamondSponsorFeeUpdate } = await this.saleSchemeData.updateUserDiamondSponsorFee({
                    id: this.data.id,
                    input: variables,
                });

                if (userDiamondSponsorFeeUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(userDiamondSponsorFeeUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
