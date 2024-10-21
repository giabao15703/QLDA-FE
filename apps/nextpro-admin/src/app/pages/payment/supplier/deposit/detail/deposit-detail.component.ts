import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService, LoadingService } from '#shared/services';
import { E_FieldType, E_Form_Mode, I_HistoryPayment, I_HistoryPaymentForm } from '#shared/types';
import { getFile } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-payment-supplier-deposit-detail',
    templateUrl: './deposit-detail.component.html',
    styleUrl: './deposit-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, TableComponent, FormComponent],
})
export class PaymentSupplierDepositDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_HistoryPaymentForm>,
    ) {
        this.form.config = [
            {
                label: 'payment.accountID',
                name: 'username',
            },
            {
                label: 'payment.accountName',
                name: 'fullName',
            },
            {
                label: 'payment.creationDate',
                name: 'date',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'payment.bankInformation',
                name: 'bankInformation',
            },
            {
                label: 'payment.transactionDescription',
                name: 'transactionDescription',
            },
            {
                label: 'payment.orderNo',
                name: 'orderNo',
            },
            {
                label: 'payment.transferAmount',
                name: 'balance',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'payment.debitAmount',
                name: 'amount',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'payment.accountBalance',
                name: 'adminBalance',
                suffix: { text: 'VNĐ' },
            },
            {
                label: 'payment.paidBy',
                name: 'methodPayment',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'payment.wallet', value: 1 },
                    { label: 'payment.bankTransfer', value: 2 },
                    { label: 'payment.onepay', value: 3 },
                ],
            },
            {
                label: 'payment.bankTransferDoc',
                name: 'bankTransferDoc',
                fieldType: E_FieldType.UPLOAD,
                showDownload: true,
            },
            {
                label: 'payment.invoiceReceipt',
                name: 'invoiceReceipt',
                fieldType: E_FieldType.UPLOAD,
                showDownload: true,
            },
            {
                label: 'payment.draftInvoice',
                name: 'draftInvoice',
                fieldType: E_FieldType.UPLOAD,
                showDownload: true,
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_HistoryPayment;
    @Input() onCloseDrawer;
    @Input() refetch;

    showUpdateStatus = false;

    async ngOnChanges(changes) {
        if (changes?.mode?.currentValue !== E_Form_Mode.CREATE) {
            if (this.data) {
                const paymentDetail = this.data;

                this.form.patchValue({
                    username: paymentDetail.userPayment?.user?.username,
                    fullName: paymentDetail.userPayment?.user?.fullName,
                    date: paymentDetail.date,
                    bankInformation: paymentDetail.bankTransferHistory?.bankTransfer?.bankInformation ?? '',
                    transactionDescription: paymentDetail.transactionDescription,
                    orderNo: paymentDetail.orderNo,
                    balance: paymentDetail.balance,
                    amount: paymentDetail.amount,
                    adminBalance: paymentDetail.adminBalance,
                    methodPayment: paymentDetail.methodPayment,
                    bankTransferDoc: await getFile(
                        paymentDetail.bankTransferHistory?.bankTransfer?.paymentsOrderAttached?.edges?.[0]?.node?.file,
                    ),
                    invoiceReceipt: await getFile(paymentDetail.invoiceReceipt),
                    draftInvoice: await getFile(paymentDetail.requestDraftInvoice),
                });

                this.showUpdateStatus =
                    (paymentDetail.methodPayment === 2 && paymentDetail.status === 1) || paymentDetail.status === 4;

                this.form.mutate({
                    disableAll: [
                        'username',
                        'fullName',
                        'date',
                        'bankInformation',
                        'transactionDescription',
                        'orderNo',
                        'balance',
                        'amount',
                        'adminBalance',
                        'methodPayment',
                        'bankTransferDoc',
                        'invoiceReceipt',
                        'draftInvoice',
                    ],
                });
            }
        }
    }
}
