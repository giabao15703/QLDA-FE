import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, PaymentDataService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_HistoryPayment, I_QueryVariables } from '#shared/types';
import { formatDate, formatMoney, getFileName, getQueryVariables } from '#shared/utils';
import { PaymentSupplierMainDetailComponent } from '../detail/main-detail.component';

const TAB_NAME = 'main';

@Component({
    standalone: true,
    selector: 'nextpro-admin-payment-supplier-main-list',
    templateUrl: './main-list.component.html',
    styleUrl: './main-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        PaymentSupplierMainDetailComponent,
        RouterModule,
    ],
})
export class PaymentSupplierMainListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_HistoryPayment>,
        private routeService: RouteService,
        private paymentService: PaymentDataService,
        private translateService: TranslateService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'payment.accountID',
                name: 'username',
            },
            {
                label: 'payment.accountName',
                name: 'userType',
            },
            {
                label: 'payment.orderNo',
                name: 'orderNo',
            },
            {
                label: 'payment.creationDate',
                name: 'date',
            },
            {
                label: 'payment.transactionDescription',
                name: 'transactionDescription',
            },
            {
                label: 'payment.transferAmount',
                name: 'balance',
            },
            {
                label: 'payment.debitAmountFrom',
                name: 'amountFrom',
            },
            {
                label: 'payment.debitAmountTo',
                name: 'amountTo',
            },
            {
                label: 'payment.accountBalance',
                name: 'adminBalance',
            },
            {
                label: 'payment.paidBy',
                name: 'methodPayment',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'payment.wallet', value: 1 },
                    { label: 'payment.bankTransfer', value: 2 },
                    { label: 'payment.onePay', value: 3 },
                ],
            },
            {
                label: 'payment.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'payment.confirmed', value: 1 },
                    { label: 'payment.paid', value: 2 },
                    { label: 'payment.refundingDeposit', value: 3 },
                    { label: 'payment.requestRefunding', value: 4 },
                    { label: 'payment.refunded', value: 5 },
                    { label: 'payment.cancelled', value: 6 },
                    { label: 'payment.pending', value: 7 },
                    { label: 'payment.refundedDeposit', value: 8 },
                    { label: 'payment.chargedDeposit', value: 9 },
                    { label: 'payment.closed', value: 10 },
                ],
            },
        ];
        this.table.config.columns = [
            {
                name: 'pk',
                sort: 'id',
                label: 'payment.logId',
            },
            {
                name: 'userPayment.user.username',
                sort: 'username',
                label: 'payment.accountID',
            },
            {
                name: 'userPayment.user.supplier.companyFullName',
                sort: 'full_name',
                label: 'payment.companyName',
            },
            {
                name: 'orderNo',
                sort: 'order_no',
                label: 'payment.orderNo',
            },
            {
                sort: 'date',
                name: 'date',
                label: 'payment.creationDate',
                render: formatDate,
            },
            {
                name: 'transactionDescription',
                sort: 'transaction_description',
                label: 'payment.transactionDescription',
            },
            {
                cellStyle: { width: '200px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'balance',
                sort: 'balance',
                label: 'payment.transferAmount',
                render: formatMoney,
            },
            {
                cellStyle: { width: '200px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'amount',
                sort: 'amount',
                label: 'payment.debitAmount',
                render: formatMoney,
            },
            {
                cellStyle: { width: '200px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'adminBalance',
                sort: 'admin_balance',
                label: 'payment.accountBalance',
                render: formatMoney,
            },
            {
                name: 'methodPayment',
                sort: 'paid_by',
                label: 'payment.paidBy',
                render: (cell) => {
                    let methodText;

                    switch (cell) {
                        case 1:
                            methodText = 'payment.wallet';
                            break;
                        case 2:
                            methodText = 'payment.bankTransfer';
                            break;
                        case 3:
                            methodText = 'payment.onepay';
                            break;
                    }

                    return this.translateService.instant(methodText);
                },
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'payment.status',
                render: (cell) => {
                    let status;
                    let statusText;

                    switch (cell) {
                        case 1:
                            status = 'confirmed';
                            statusText = 'payment.confirmed';
                            break;
                        case 2:
                            status = 'paid';
                            statusText = 'payment.paid';
                            break;
                        case 3:
                            status = 'refunding-deposit';
                            statusText = 'payment.refundingDeposit';
                            break;
                        case 4:
                            status = 'request-refunding';
                            statusText = 'payment.requestRefunding';
                            break;
                        case 5:
                            status = 'refunded';
                            statusText = 'payment.refunded';
                            break;
                        case 6:
                            status = 'cancelled';
                            statusText = 'payment.cancelled';
                            break;
                        case 7:
                            status = 'pending';
                            statusText = 'payment.pending';
                            break;
                        case 8:
                            status = 'refunded-deposit';
                            statusText = 'payment.refundedDeposit';
                            break;
                        case 9:
                            status = 'charged-deposit';
                            statusText = 'payment.chargedDeposit';
                            break;
                        case 10:
                            status = 'closed';
                            statusText = 'payment.closed';
                            break;
                    }

                    return `<div class="text-${status}">${this.translateService.instant(statusText)}</div>`;
                },
            },
            {
                name: 'invoiceReceipt',
                label: 'payment.invoiceReceipt',
            },
            {
                type: E_TableColumnType.ACTION,
                name: 'requestDraftInvoice',
                label: 'payment.requestDraftInvoice',
                ctas: [
                    {
                        icon: 'receipt',
                        shouldShow: (row: I_HistoryPayment) => !!row?.requestDraftInvoice,
                        onClick: (row: I_HistoryPayment) => {
                            const file = row?.requestDraftInvoice;
                            FileSaver.saveAs(file, getFileName(file));
                        },
                    },
                ],
            },
            {
                type: E_TableColumnType.ACTION,
                name: 'bankTransferHistory',
                label: 'payment.bankTransferDoc',
                ctas: [
                    {
                        icon: 'receipt',
                        shouldShow: (row: I_HistoryPayment) => !!row?.bankTransferHistory,
                        onClick: (row: I_HistoryPayment) => {
                            const file =
                                row?.bankTransferHistory?.bankTransfer?.paymentsOrderAttached?.edges?.[0]?.node?.file;
                            FileSaver.saveAs(file, getFileName(file));
                        },
                    },
                ],
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'masterData.actions',
                ctas: [
                    {
                        icon: 'visibility',
                        onClick: (row: I_HistoryPayment) => {
                            this.routeService.goTo({ mode: E_Form_Mode.READ, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getHistoryPayments;

        this.routeService.onChange(({ hash }) => {
            this.getHistoryPayment(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getHistoryPayment();
        this.getHistoryPayments();
    }

    getHistoryPayment = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.paymentService.getHistoryPayment({
                    id,
                }),
        });
    };

    getHistoryPayments = async (variables?: I_QueryVariables) => {
        const historyPayments = await this.paymentService.getHistoryPayments(
            {
                ...getQueryVariables({ variables }),
                type: '1,3,4',
                userType: '3',
            },
            { extra: { variables } },
        );

        this.table.state.data = historyPayments.data;
        this.table.state.pagination = historyPayments.pagination;
        this.table.state.selection?.clear();
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
