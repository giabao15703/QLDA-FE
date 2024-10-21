import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CityDetailComponent } from '#admin/pages/master-data/city/detail/city-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_City, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-city-list',
    templateUrl: './city-list.component.html',
    styleUrl: './city-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        CityDetailComponent,
        RouterModule,
    ],
})
export class CityListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_City>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'masterData.country',
                name: 'countryNameContains',
            },
            {
                label: 'masterData.name',
                name: 'name',
            },
            {
                label: 'masterData.itemCode',
                name: 'stateCodeContains',
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
                sort: 'state_code',
                name: 'stateCode',
                label: 'masterData.code',
            },
            {
                cellStyle: { width: '100px' },
                sort: 'country',
                name: 'country',
                label: 'masterData.country',
                render: (cell) => {
                    return cell.name;
                },
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
                        onClick: (row: I_City) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getCities;

        this.routeService.onChange(({ hash }) => {
            this.getCity(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getCity();
        this.getCities();
    }

    getCity = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.masterDataService.getCity({
                    id,
                }),
        });
    };

    getCities = async (variables?: I_QueryVariables) => {
        const cities = await this.masterDataService.getCities(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = cities.data;
        this.table.state.pagination = cities.pagination;
        this.table.state.selection?.clear();
    };

    handleUpdateStatus = async (status) => {
        const selectedCities = this.table.state.selection.selected;

        const { countryStateUpdateStatus } = await this.masterDataService.updateCityStatus({
            listStatus: selectedCities.map((city) => ({
                id: city.id,
                status,
            })),
        });

        if (countryStateUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(countryStateUpdateStatus.error?.message);
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
