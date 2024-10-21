import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SaleSchemeSupplierAuctionFeeFlatrateDetailComponent } from '#admin/pages/sale-scheme/flatrate/detail/flatrate-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, RouteService, SaleSchemeService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_PlatformFee, I_QueryVariables } from '#shared/types';
import { formatMoney, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-flatrate-list',
    templateUrl: './flatrate-list.component.html',
    styleUrl: './flatrate-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        SaleSchemeSupplierAuctionFeeFlatrateDetailComponent,
        RouterModule,
    ],
})
export class SaleSchemeFlatrateListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_PlatformFee>,
        private routeService: RouteService,
        private saleSchemeData: SaleSchemeService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'saleSchemeData.title',
                name: 'title_Icontains',
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
                        onClick: (row: I_PlatformFee) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getPlatformFees;

        this.routeService.onChange(({ hash }) => {
            this.getPlatformFee(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getPlatformFee();
        this.getPlatformFees();
    }

    getPlatformFee = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.saleSchemeData.getPlatformFee({
                    id,
                }),
        });
    };

    getPlatformFees = async (variables?: I_QueryVariables) => {
        const platformFees = await this.saleSchemeData.getPlatformFees(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = platformFees.data;
        this.table.state.pagination = platformFees.pagination;
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
