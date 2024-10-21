import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, RouteService, SaleSchemeService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_ProfileFeaturesSupplier, I_QueryVariables } from '#shared/types';
import { formatMoney, getQueryVariables } from '#shared/utils';
import { SaleSchemeSupplierProfileFeatureDetailComponent } from '../detail/profile-feature-detail.component';

const TAB_NAME = 'profilefeature';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-supplier-profile-feature-list',
    templateUrl: './profile-feature-list.component.html',
    styleUrl: './profile-feature-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        SaleSchemeSupplierProfileFeatureDetailComponent,
        RouterModule,
    ],
})
export class SaleSchemeSupplierProfileFeatureListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_ProfileFeaturesSupplier>,
        private routeService: RouteService,
        private saleSchemeService: SaleSchemeService,
    ) {
        this.table.config.columns = [
            {
                name: 'name',
            },
            {
                name: 'freeRegistration',
                label: 'saleSchemeData.freeRegistration',
            },
            {
                name: 'quoteSubmiting',
                label: 'saleSchemeData.quoteSubmiting',
            },
            {
                name: 'rfxrReceivingPriority',
                label: 'saleSchemeData.rfxReceivingPriority',
            },
            {
                name: 'subUserAccounts',
                label: 'saleSchemeData.subUserAccounts',
            },
            {
                name: 'helpDesk',
                label: 'saleSchemeData.helpdesk',
            },
            {
                name: 'flashSale',
                label: 'saleSchemeData.featuredProducts',
            },
            {
                name: 'product',
                label: 'saleSchemeData.product',
            },
            {
                name: 'reportYear',
                label: 'saleSchemeData.reportYear',
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'baseRateMonth',
                label: 'saleSchemeData.baseRateMonth',
                render: formatMoney,
            },
            {
                cellStyle: { width: '150px' },
                cellContentStyle: { textAlign: 'right' },
                name: 'baseRateFullYear',
                label: 'saleSchemeData.baseRateYear',
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
                        onClick: (row: I_ProfileFeaturesSupplier) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getProfileFeaturesSupplier;

        this.routeService.onChange(({ hash }) => {
            this.getProfileFeatureSupplier(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getProfileFeatureSupplier();
        this.getProfileFeaturesSupplier();
    }

    getProfileFeatureSupplier = async (hash?: string) => {
        const profileFeaturesSupplier = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.saleSchemeService.getProfileFeaturesSupplier({
                    id,
                }),
        });

        if (!profileFeaturesSupplier) {
            this.detail = null;
        } else {
            this.detail = { mode: profileFeaturesSupplier.mode, data: profileFeaturesSupplier.data.data[0] };
        }
    };

    getProfileFeaturesSupplier = async (variables?: I_QueryVariables) => {
        const profileFeaturesSupplier = await this.saleSchemeService.getProfileFeaturesSupplier(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = profileFeaturesSupplier.data;
        this.table.state.pagination = profileFeaturesSupplier.pagination;
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
