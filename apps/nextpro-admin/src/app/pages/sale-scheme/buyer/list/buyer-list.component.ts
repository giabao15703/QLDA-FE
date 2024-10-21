import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BuyerDetailComponent } from '#admin/pages/sale-scheme/buyer/detail/buyer-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, RouteService, SaleSchemeService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_ProfileFeaturesBuyer, I_QueryVariables } from '#shared/types';
import { formatMoney, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-buyer-list',
    templateUrl: './buyer-list.component.html',
    styleUrl: './buyer-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        BuyerDetailComponent,
        RouterModule,
    ],
})
export class SaleSchemeBuyerListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_ProfileFeaturesBuyer>,
        private routeService: RouteService,
        private saleSchemeService: SaleSchemeService,
    ) {
        this.table.config.columns = [
            {
                name: 'name',
            },
            {
                name: 'marketResearch',
                label: 'saleSchemeData.marketResearch',
            },
            {
                name: 'rfxYear',
                label: 'saleSchemeData.rfxYear',
            },
            {
                name: 'noEauctionYear',
                label: 'saleSchemeData.noEAuctionsYear',
            },
            {
                name: 'helpDesk',
                label: 'saleSchemeData.helpdesk',
            },
            {
                name: 'reportYear',
                label: 'saleSchemeData.reportYear',
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'feeEauction',
                label: 'saleSchemeData.feeEAuction',
                render: formatMoney,
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'totalFeeYear',
                label: 'saleSchemeData.totalFeeYear',
                render: formatMoney,
            },
            {
                name: 'subUserAccounts',
                label: 'saleSchemeData.subUserAccounts',
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
                        onClick: (row: I_ProfileFeaturesBuyer) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getProfileFeaturesBuyer;

        this.routeService.onChange(({ hash }) => {
            this.getProfileFeatureBuyer(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getProfileFeatureBuyer();
        this.getProfileFeaturesBuyer();
    }

    getProfileFeatureBuyer = async (hash?: string) => {
        const profileFeaturesBuyer = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.saleSchemeService.getProfileFeaturesBuyer({
                    id,
                }),
        });

        if (!profileFeaturesBuyer) {
            this.detail = null;
        } else {
            this.detail = { mode: profileFeaturesBuyer.mode, data: profileFeaturesBuyer.data.data[0] };
        }
    };

    getProfileFeaturesBuyer = async (variables?: I_QueryVariables) => {
        const profileFeaturesBuyer = await this.saleSchemeService.getProfileFeaturesBuyer(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = profileFeaturesBuyer.data;
        this.table.state.pagination = profileFeaturesBuyer.pagination;
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
