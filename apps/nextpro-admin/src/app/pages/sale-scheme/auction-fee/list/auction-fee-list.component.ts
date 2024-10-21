import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SaleSchemeSupplierAuctionFeeDetailComponent } from '#admin/pages/sale-scheme/auction-fee/detail/auction-fee-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, RouteService, SaleSchemeService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_AuctionFee, I_QueryVariables } from '#shared/types';
import { formatDate, formatMoney, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-auction-fee-list',
    templateUrl: './auction-fee-list.component.html',
    styleUrl: './auction-fee-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
        SaleSchemeSupplierAuctionFeeDetailComponent,
    ],
})
export class SaleSchemeAuctionFeeListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_AuctionFee>,
        private routeService: RouteService,
        private saleSchemeData: SaleSchemeService,
    ) {
        this.table.config.filterForm = [
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
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                name: 'no',
                label: 'masterData.no',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                cellContentStyle: { textAlign: 'right' },
                sort: 'min_value',
                name: 'minValue',
                label: 'saleSchemeData.amountFrom',
                render: formatMoney,
            },
            {
                cellContentStyle: { textAlign: 'right' },
                sort: 'max_value',
                name: 'maxValue',
                label: 'saleSchemeData.amountFrom',
                render: formatMoney,
            },
            {
                sort: 'percentage',
                name: 'percentage',
                label: 'saleSchemeData.percentage',
                render: (cell) => `${cell}%`,
            },
            {
                name: 'createdDate',
                label: 'saleSchemeData.createdDate',
                render: formatDate,
            },
            {
                name: 'createdBy',
                label: 'saleSchemeData.createdBy',
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
                        onClick: (row: I_AuctionFee) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getAuctionFees;

        this.routeService.onChange(({ hash }) => {
            this.getAuctionFee(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getAuctionFee();
        this.getAuctionFees();
    }

    getAuctionFee = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.saleSchemeData.getAuctionFee({
                    id,
                }),
        });
    };

    getAuctionFees = async (variables?: I_QueryVariables) => {
        const auctionFees = await this.saleSchemeData.getAuctionFees(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = auctionFees.data;
        this.table.state.pagination = auctionFees.pagination;
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
