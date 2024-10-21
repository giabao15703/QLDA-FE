import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, RouteService, SaleSchemeService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_QueryVariables, I_SicpRegistration } from '#shared/types';
import { formatMoney, getQueryVariables } from '#shared/utils';
import { SaleSchemeSupplierSicpRegistrationDetailComponent } from '../detail/sicp-detail.component';

const TAB_NAME = 'sicp';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-supplier-sicp-list',
    templateUrl: './sicp-list.component.html',
    styleUrl: './sicp-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        SaleSchemeSupplierSicpRegistrationDetailComponent,
        RouterModule,
    ],
})
export class SaleSchemeSupplierSicpListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_SicpRegistration>,
        private routeService: RouteService,
        private saleSchemeService: SaleSchemeService,
    ) {
        this.table.config.columns = [
            {
                name: 'name',
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'legalStatus',
                label: 'saleSchemeData.legalStatus',
                render: formatMoney,
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'bankAccount',
                label: 'saleSchemeData.bankAccount',
                render: formatMoney,
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'sanctionCheck',
                label: 'saleSchemeData.sanctionCheck',
                render: formatMoney,
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'certificateManagement',
                label: 'saleSchemeData.certificateManagement',
                render: formatMoney,
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'dueDiligence',
                label: 'saleSchemeData.dueDiligence',
                render: formatMoney,
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'financialRisk',
                label: 'saleSchemeData.financialRisk',
                render: formatMoney,
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'totalAmount',
                label: 'saleSchemeData.totalAmount',
                render: formatMoney,
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'saleSchemeData.update',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_SicpRegistration) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getSicpRegistrations;

        this.routeService.onChange(({ hash }) => {
            this.getSicpRegistration(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getSicpRegistration();
        this.getSicpRegistrations();
    }

    getSicpRegistration = async (hash?: string) => {
        const sicpRegistrations = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.saleSchemeService.getSicpRegistration({
                    id,
                }),
        });

        if (!sicpRegistrations) {
            this.detail = null;
        } else {
            this.detail = { mode: sicpRegistrations.mode, data: sicpRegistrations.data.data[0] };
        }
    };

    getSicpRegistrations = async (variables?: I_QueryVariables) => {
        const sicpRegistrations = await this.saleSchemeService.getSicpRegistration(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = sicpRegistrations.data;
        this.table.state.pagination = sicpRegistrations.pagination;
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
