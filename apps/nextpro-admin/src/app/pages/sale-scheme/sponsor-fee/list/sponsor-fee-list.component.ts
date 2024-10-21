import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SaleSchemeSupplierSponsorFeeDetailComponent } from '#admin/pages/sale-scheme/sponsor-fee/detail/sponsor-fee-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, RouteService, SaleSchemeService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_QueryVariables, I_UserDiamondSponsorFee } from '#shared/types';
import { formatMoney, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-sponsor-fee-list',
    templateUrl: './sponsor-fee-list.component.html',
    styleUrl: './sponsor-fee-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
        SaleSchemeSupplierSponsorFeeDetailComponent,
    ],
})
export class SaleSchemeSponsorFeeListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_UserDiamondSponsorFee>,
        private routeService: RouteService,
        private saleSchemeData: SaleSchemeService,
    ) {
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
                sort: 'title',
                name: 'title',
                label: 'saleSchemeData.title',
            },
            {
                sort: 'fee',
                name: 'fee',
                label: 'saleSchemeData.amount',
                render: formatMoney,
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
                        onClick: (row: I_UserDiamondSponsorFee) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getUserDiamondSponsorFees;

        this.routeService.onChange(({ hash }) => {
            this.getUserDiamondSponsorFee(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getUserDiamondSponsorFee();
        this.getUserDiamondSponsorFees();
    }

    getUserDiamondSponsorFee = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.saleSchemeData.getUserDiamondSponsorFee({
                    id,
                }),
        });
    };

    getUserDiamondSponsorFees = async (variables?: I_QueryVariables) => {
        const userDiamondSponsorFees = await this.saleSchemeData.getUserDiamondSponsorFees(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = userDiamondSponsorFees.data;
        this.table.state.pagination = userDiamondSponsorFees.pagination;
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
