import { ConfirmComponent, FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    PaymentDataService,
} from '#shared/services';
import { E_ContainerType, E_FieldType, E_PromotionScope, I_Bank } from '#shared/types';
import { formatMoney, getFile, reverseFormatMoney } from '#shared/utils';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { BankService } from 'shared/services/bank.service';

@Component({
    standalone: true,
    selector: 'app-supplier-payment-bank-transfer',
    templateUrl: './bank-transfer.component.html',
    styleUrls: ['./bank-transfer.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule,
        MaterialModules,
        MatButtonModule,
        FormComponent,
    ],
})
export class SupplierPaymentBankTransferComponent implements OnInit {
    constructor(
        public dialog: MatDialog,
        public form: FormService,
        public router: Router,
        private bankService: BankService,
        private paymentService: PaymentDataService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
        private notificationService: NotificationService,
        private localStorageService: LocalStorageService,
    ) {
        this.form.config = [
            {
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.DIV,
                children: [
                    {
                        name: 'accountBalanceContainer',
                        class: 'my-8 grid gap-2 grid-cols-1',
                        fieldType: E_FieldType.CONTAINER,
                        containerType: E_ContainerType.FIELDSET,
                        label: 'paymentAccount.secondStep.bankTransfer.titleForm',
                        children: [
                            {
                                label: 'paymentAccount.secondStep.form.nameSupplier',
                                name: 'nameSupplier',
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'Please fill valid from',
                                    },
                                ],
                            },
                            {
                                label: 'paymentAccount.secondStep.form.supplierInfo',
                                name: 'supplierInfo',
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'Please fill valid from',
                                    },
                                ],
                            },
                            {
                                label: 'paymentAccount.secondStep.form.amount',
                                name: 'amount',
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'Please fill valid from',
                                    },
                                ],
                            },
                            {
                                fieldType: E_FieldType.TEXT,
                                value: 'paymentAccount.secondStep.form.reference',
                                class: 'text-lg',
                            },
                            {
                                fieldType: E_FieldType.TEXT,
                                value: 'paymentAccount.secondStep.form.paymentDesc',
                                class: 'text-sm text-gray-500',
                            },
                            {
                                label: 'paymentAccount.secondStep.form.bankNum',
                                name: 'bankNum',
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'Please fill valid from',
                                    },
                                ],
                            },
                            {
                                fieldType: E_FieldType.SELECT,
                                label: 'paymentAccount.secondStep.form.bankName',
                                name: 'bankName',
                                getOptions: () => this.bankService.getBanks().then((res) => res),
                                mapOption: (item: I_Bank) => ({
                                    label: item.name,
                                    value: item.id,
                                }),
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'Please fill valid from',
                                    },
                                ],
                            },
                            {
                                fieldType: E_FieldType.DATEPICKER,
                                label: 'paymentAccount.secondStep.form.dateOfPayment',
                                name: 'dateOfPayment',
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'Please fill valid from',
                                    },
                                ],
                            },
                            {
                                fieldType: E_FieldType.UPLOAD,
                                label: 'paymentAccount.secondStep.form.paymentOrderAttached',
                                name: 'paymentOrderAttached',
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'Please fill valid from',
                                    },
                                ],
                            },
                            {
                                fieldType: E_FieldType.TEXT,
                                value: 'paymentAccount.secondStep.form.note',
                                class: 'text-sm text-gray-500',
                            },
                        ],
                    },
                ],
            },
        ];
    }

    ngOnInit(): void {
        this.loadSupplierInfo();
    }

    async loadSupplierInfo() {
        const accountPaymentInfo = this.localStorageService.get('AccountPaymentInfo');
        if (accountPaymentInfo) {
            this.form.patchValue({
                nameSupplier: accountPaymentInfo.fullName,
                supplierInfo: accountPaymentInfo.accountName,
                amount: formatMoney(accountPaymentInfo.grandTotal),
            });
        }
    }

    handleClose = () => {
        this.router.navigateByUrl('');
    };

    handlePayment = () => {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: { title: this.translateService.instant('payment.components.popups.makeARequest'), message: '' },
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                const accountPaymentInfo = this.localStorageService.get('AccountPaymentInfo');
                if (accountPaymentInfo) {
                    const { supplierInfo, amount, bankNum, bankName, dateOfPayment, paymentOrderAttached } =
                        this.form.getRawValue();

                    const promotionList = await this.checkPromotions(accountPaymentInfo);

                    const { bankTransferCreate } = await this.paymentService.createBankTransfer({
                        bankTransferInput: {
                            bankInformation: supplierInfo as string,
                            order: accountPaymentInfo?.orderNumber,
                            bankAccountNumber: bankNum,
                            bank: bankName as string,
                            dayOfPayment: dateOfPayment as string,
                            paymentOrderAttached: [await getFile(paymentOrderAttached)],
                            amount: reverseFormatMoney(amount),
                        },
                        payment: {
                            type: 1,
                            profileFeatures: accountPaymentInfo?.profileFeatures?.id,
                            sicpRegistration: accountPaymentInfo?.sicp?.id,
                            promotionList,
                        },
                    });
                    if (bankTransferCreate.status) {
                        this.notificationService.success('Payment successfully processed.');
                    } else {
                        this.notificationService.error(bankTransferCreate.error.message);
                    }
                } else {
                    this.notificationService.error('ERROR.accountPaymentInfoMissing');
                }
            }
            this.router.navigateByUrl('/');
        });
    };

    async checkPromotions(acc): Promise<any[] | null> {
        const promotionList = [];

        const checkPromotion = async (promotionCode, type: E_PromotionScope) => {
            const promotionResults = await this.masterDataService.getPromotionResults({
                promotionCode,
                forSupplierScope: type,
            });
            if (promotionResults.data.length === 0) {
                this.notificationService.error('ERROR.promotionCodeNotExits');
                return null;
            } else {
                const { promotion } = promotionResults.data[0];
                return { promotionId: promotion.id, promotionType: type };
            }
        };

        // Profile feature promotion
        if (acc.promotionProfileFeatures) {
            const profilePromotion = await checkPromotion(
                acc.promotionProfileFeatures.code,
                acc.promotionProfileFeatures.type,
            );
            if (!profilePromotion) return null;
            promotionList.push(profilePromotion);
        }

        // SICP promotion
        if (acc.promotionSICP) {
            const sicpPromotion = await checkPromotion(acc.promotionSICP.code, acc.promotionSICP.type);
            if (!sicpPromotion) return null;
            promotionList.push(sicpPromotion);
        }

        return promotionList;
    }
}
