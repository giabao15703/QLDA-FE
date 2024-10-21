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
import { E_Form_Mode, I_PlatformFee, I_PlatformFeeForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_SALE_SCHEME_FLAT_RATE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-flatrate-detail',
    templateUrl: './flatrate-detail.component.html',
    styleUrl: './flatrate-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class SaleSchemeSupplierAuctionFeeFlatrateDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_PlatformFeeForm>,
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
    @Input() data: I_PlatformFee;
    @Input() onCloseDrawer;
    @Input() refetch;

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    ngOnChanges(changes) {
        if (changes?.mode?.currentValue !== E_Form_Mode.CREATE) {
            if (this.data) {
                const platformFeeDetail = this.data;

                this.form.patchValue({
                    title: platformFeeDetail.title,
                    fee: platformFeeDetail.fee,
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

            if (this.mode === E_Form_Mode.UPDATE) {
                const { platformFeeUpdate } = await this.saleSchemeData.updatePlatformFee({
                    id: this.data.id,
                    ...variables,
                });

                if (platformFeeUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(platformFeeUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
