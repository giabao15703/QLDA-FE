import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CityDetailComponent } from '#admin/pages/master-data/city/detail/city-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, I_City, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { NavbarComponent } from '#user/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-e-auction',
    templateUrl: './e-auction.component.html',
    styleUrl: './e-auction.component.scss',
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
export class EAuctionComponent {
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
                label: 'eauction.eAuctionNumber',
                name: 'eAuctionNumber',
            },
            {
                label: 'eauction.title',
                name: 'name',
            },
            {
                label: 'eauction.status',
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
                label: 'eauction.type',
                name: 'type',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'eauction.dutch',
                        value: 2,
                    },
                    {
                        label: 'eauction.ja',
                        value: 1,
                    },
                    {
                        label: 'eauction.price',
                        value: 3,
                    },
                    {
                        label: 'eauction.ranking',
                        value: 4,
                    },
                    {
                        label: 'eauction.sealedBid',
                        value: 5,
                    },
                    {
                        label: 'eauction.trafficLight',
                        value: 6,
                    },
                ],
            },
            {
                label: 'eauction.startDate',
                name: 'stateCodeContains',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'eauction.endDate',
                name: 'endDate',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'eauction.valueFrom',
                name: 'valueFrom',
            },
            {
                label: 'eauction.valueFrom',
                name: 'valueFrom',
            },
            {
                label: 'eauction.awardedSupplier',
                name: 'stateCodeContains',
            },
        ];
        this.table.config.columns = [
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'name',
                name: 'noRFX',
                label: 'eauction.eAuctionNumber',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'name',
                name: 'typeRFX',
                label: 'eauction.title',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'title',
                label: 'eauction.startDate',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'purchasing',
                label: 'eauction.endDate',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'dueDate',
                label: 'eauction.purchasingCompany',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'seateAvailable',
                label: 'eauction.status',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'state_code',
                name: 'statusRFX',
                label: 'eauction.live',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'country',
                name: 'quote',
                label: 'eauction.awardedSupplier',
            },
            {
                headerStyle: { backgroundColor: '#dbdbdb' },
                sort: 'country',
                name: 'action',
                label: 'eauction.action',
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
