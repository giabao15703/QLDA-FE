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
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_BuyerClubVoucher, I_BuyerClubVoucherForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_BUYER_CLUB_VOUCHER';

@Component({
    standalone: true,
    selector: 'nextpro-admin-buyer-club-voucher-detail',
    templateUrl: './buyer-club-voucher-detail.component.html',
    styleUrl: './buyer-club-voucher-detail.component.scss',
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
export class BuyerClubVoucherDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_BuyerClubVoucherForm>,
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
                label: 'voucher.descriptionEN',
                name: 'descriptionEn',
            },
            {
                label: 'voucher.descriptionVN',
                name: 'descriptionVi',
            },
            {
                label: 'buyerClubVoucher.discountStandard',
                name: 'standard',
            },
            {
                label: 'buyerClubVoucher.discountGold',
                name: 'gold',
            },
            {
                label: 'buyerClubVoucher.discountPlatinum',
                name: 'platinum',
            },
            {
                label: 'buyerClubVoucher.discountDiamond',
                name: 'diamond',
            },
            {
                label: 'buyerClubVoucher.uploadFile',
                name: 'label',
            },
            {
                label: 'voucher.status',
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
    @Input() data: I_BuyerClubVoucher;
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
                const buyerClubVoucherDetail = this.data;

                this.form.patchValue({
                    voucherCode: buyerClubVoucherDetail.voucherCode,
                    descriptionEn: translateData(buyerClubVoucherDetail, 'en', 'description'),
                    descriptionVi: translateData(buyerClubVoucherDetail, 'vi', 'description'),
                    standard: buyerClubVoucherDetail.standard,
                    gold: buyerClubVoucherDetail.gold,
                    platinum: buyerClubVoucherDetail.platinum,
                    diamond: buyerClubVoucherDetail.diamond,
                    label: buyerClubVoucherDetail.label,
                    status: buyerClubVoucherDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    descriptions: [],
                    voucherCode: values.voucherCode,
                    standard: values.standard,
                    gold: values.gold,
                    platinum: values.platinum,
                    diamond: values.diamond,
                    label: values.label,
                    status: values.status,
                },
            };
            if (values.descriptionEn) {
                variables.input.descriptions.push({ description: values.descriptionEn, languageCode: 'en' });
            }

            if (values.descriptionVi) {
                variables.input.descriptions.push({ description: values.descriptionVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { buyerClubVoucherCreate } = await this.masterDataService.createBuyerClubVoucher({
                    ...variables,
                });

                if (buyerClubVoucherCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(buyerClubVoucherCreate.error?.message);
                }
            } else {
                const { buyerClubVoucherUpdate } = await this.masterDataService.updateBuyerClubVoucher({
                    id: this.data.id,
                    ...variables,
                });

                if (buyerClubVoucherUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(buyerClubVoucherUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
