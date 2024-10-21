import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, PaymentDataService, RouteService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_HistoryPayment, I_QueryVariables } from '#shared/types';
import { getFileName, getQueryVariables } from '#shared/utils';
import * as FileSaver from 'file-saver';
import { PaymentSupplierDepositDetailComponent } from '../detail/deposit-detail.component';

const TAB_NAME = 'deposit';

@Component({
    standalone: true,
    selector: 'nextpro-admin-payment-supplier-deposit-list',
    templateUrl: './deposit-list.component.html',
    styleUrl: './deposit-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        PaymentSupplierDepositDetailComponent,
        RouterModule,
    ],
})
export class PaymentSupplierDepositListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_HistoryPayment>,
        private routeService: RouteService,
        private paymentService: PaymentDataService,
    ) {
        this.table.config.columns = [
            {
                name: 'userPayment.user.username',
                label: 'payment.accountID',
            },
            {
                name: 'accountName',
                label: 'payment.accountName',
            },
            {
                name: 'orderNo',
                label: 'payment.orderNo',
            },

            {
                name: 'created',
                label: 'payment.createdDate',
            },
            {
                name: 'transactionDescription',
                label: 'payment.transactionDescription',
            },
            {
                name: 'auctionStatus',
                label: 'payment.auctionStatus',
            },
            {
                name: 'depositFlatrate',
                label: 'payment.depositFlatrate',
            },
            {
                name: 'supplierStatus',
                label: 'payment.supplierStatus',
            },
            {
                name: 'depositStatus',
                label: 'payment.depositStatus',
            },
            {
                name: 'depositBy',
                label: 'payment.depositBy',
            },
            {
                name: 'depositeByBankTransfer',
                label: 'payment.depositeByBankTransfer',
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
                        icon: 'edit',
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
                type: '2',
            },
            { extra: { variables } },
        );

        this.table.state.data = historyPayments.data;
        this.table.state.pagination = historyPayments.pagination;
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
