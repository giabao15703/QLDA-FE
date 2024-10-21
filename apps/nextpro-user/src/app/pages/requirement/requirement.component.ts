import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CityDetailComponent } from '#admin/pages/master-data/city/detail/city-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, I_City, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { NavbarComponent } from '#user/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-requirement',
    templateUrl: './requirement.component.html',
    styleUrl: './requirement.component.scss',
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
        NavbarComponent,
    ],
})
export class RequirementComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_City>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'requirement.noRFX',
                name: 'countryNameContains',
            },
            {
                label: 'requirement.typeRFX',
                name: 'name',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'requirement.rfi',
                        value: 2,
                    },
                    {
                        label: 'requirement.rfp',
                        value: 1,
                    },
                    {
                        label: 'requirement.rfq',
                        value: 3,
                    },
                    {
                        label: 'requirement.po',
                        value: 4,
                    },
                ],
            },
            {
                label: 'requirement.statusRFX',
                name: 'stateCodeContains',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'requirement.draft',
                        value: 2,
                    },
                    {
                        label: 'requirement.published',
                        value: 1,
                    },
                    {
                        label: 'requirement.dueDateExpire',
                        value: 3,
                    },
                    {
                        label: 'requirement.awarded',
                        value: 4,
                    },
                    {
                        label: 'requirement.Eauction',
                        value: 5,
                    },
                    {
                        label: 'requirement.negotiation',
                        value: 6,
                    },
                    {
                        label: 'requirement.completed',
                        value: 7,
                    },
                    {
                        label: 'requirement.cancelled',
                        value: 8,
                    },
                    {
                        label: 'requirement.confirmed',
                        value: 9,
                    },
                ],
            },
            {
                label: 'requirement.title',
                name: 'stateCodeContains',
            },
            {
                label: 'requirement.seateAvailable',
                name: 'stateCodeContains',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'requirement.available',
                        value: 2,
                    },
                    {
                        label: 'requirement.fullSeat',
                        value: 1,
                    },
                ],
            },
            {
                label: 'requirement.dueDate',
                name: 'stateCodeContains',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'requirement.quote',
                name: 'stateCodeContains',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'requirement.waiting_for_quotes',
                        value: 2,
                    },
                    {
                        label: 'requirement.submmitted',
                        value: 1,
                    },
                    {
                        label: 'requirement.Eauction',
                        value: 3,
                    },
                    {
                        label: 'requirement.awarded',
                        value: 1,
                    },
                    {
                        label: 'requirement.reject',
                        value: 1,
                    },
                    {
                        label: 'requirement.closed',
                        value: 1,
                    },
                ],
            },
            {
                label: 'requirement.purchasing',
                name: 'stateCodeContains',
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                headerStyle: { backgroundColor: '#dbdbdb' },
                sticky: 'left',
                name: 'no',
                label: 'masterData.no',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'name',
                name: 'noRFX',
                label: 'requirement.noRFX',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'name',
                name: 'typeRFX',
                label: 'requirement.typeRFX',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'title',
                label: 'requirement.title',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'purchasing',
                label: 'requirement.purchasing',
            },
            {
                cellStyle: { width: '150px' },
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'dueDate',
                label: 'requirement.dueDate',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'seateAvailable',
                label: 'requirement.seateAvailable',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'statusRFX',
                label: 'requirement.statusRFX',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'country',
                name: 'quote',
                label: 'requirement.quote',
            },
        ];
        this.table.config.refetch = this.getCities;

        this.routeService.onChange(({ hash }) => {
            this.getCity(hash);
        });
    }

    detail = null;
    filterVisible = false;

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

    toggleFilter() {
        this.filterVisible = !this.filterVisible;
    }
}
