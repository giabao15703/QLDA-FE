import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CountryDetailComponent } from '#admin/pages/master-data/country/detail/country-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Country, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-country-list',
    templateUrl: './country-list.component.html',
    styleUrl: './country-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        CountryDetailComponent,
        RouterModule,
    ],
})
export class CountryListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Country>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'masterData.name',
                name: 'name',
            },
            {
                label: 'masterData.itemCode',
                name: 'itemCode_Icontains',
            },
            {
                label: 'masterData.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'masterData.active',
                        value: true,
                    },
                    {
                        label: 'masterData.inactive',
                        value: false,
                    },
                ],
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                type: E_TableColumnType.SELECTION,
                name: 'selection',
            },
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
                cellStyle: { width: '200px' },
                sort: 'name',
                name: 'name',
                label: 'masterData.name',
            },
            {
                cellStyle: { width: '100px' },
                sort: 'item_code',
                name: 'itemCode',
                label: 'masterData.code',
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'masterData.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                    ${this.translateService.instant(cell ? 'masterData.active' : 'masterData.inactive')}
                    </div>`;
                },
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
                        onClick: (row: I_Country) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getCountries;

        this.routeService.onChange(({ hash }) => {
            this.getCountry(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getCountry();
        this.getCountries();
    }

    getCountry = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.masterDataService.getCountry({
                    id,
                }),
        });
    };

    getCountries = async (variables?: I_QueryVariables) => {
        const countries = await this.masterDataService.getCountries(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = countries.data;
        this.table.state.pagination = countries.pagination;
        this.table.state.selection?.clear();
    };

    handleUpdateStatus = async (status) => {
        const selectedCountries = this.table.state.selection.selected;

        const { countryUpdateStatus } = await this.masterDataService.updateCountryStatus({
            listStatus: selectedCountries.map((country) => ({
                countryId: country.id,
                status,
            })),
        });

        if (countryUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(countryUpdateStatus.error?.message);
        }
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
