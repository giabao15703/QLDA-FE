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
import { E_Form_Mode, I_AuctionFee, I_AuctionFeeForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_SALE_SCHEME_AUCTION_FEE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-auction-fee-detail',
    templateUrl: './auction-fee-detail.component.html',
    styleUrl: './auction-fee-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class SaleSchemeSupplierAuctionFeeDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_AuctionFeeForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private saleSchemeData: SaleSchemeService,
    ) {
        this.form.config = [
            {
                label: 'saleSchemeData.amountFrom',
                name: 'minValue',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.amountTo',
                name: 'maxValue',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'saleSchemeData.percentage',
                name: 'percentage',
                suffix: { text: '%' },
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_AuctionFee;
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
                const auctionFeeDetail = this.data;

                this.form.patchValue({
                    minValue: auctionFeeDetail.minValue,
                    maxValue: auctionFeeDetail.maxValue,
                    percentage: auctionFeeDetail.percentage,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                minValue: parseFloat(values.minValue),
                maxValue: parseFloat(values.maxValue),
                percentage: parseFloat(values.percentage),
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { auctionFeeCreate } = await this.saleSchemeData.createAuctionFee({
                    auctionFee: variables,
                });

                if (auctionFeeCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(auctionFeeCreate.error?.message);
                }
            } else {
                const { auctionFeeUpdate } = await this.saleSchemeData.updateAuctionFee({
                    id: this.data.id,
                    input: variables,
                });

                if (auctionFeeUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(auctionFeeUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
