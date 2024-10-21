import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, ImportComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { DeliveryService, LoadingService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_QueryVariables, I_ShippingFee } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { ShippingFeeDetailComponent } from '../detail/shipping-fee-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-shipping-fee-list',
    templateUrl: './shipping-fee-list.component.html',
    styleUrl: './shipping-fee-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        ShippingFeeDetailComponent,
    ],
})
export class AdminDeliveryShippingFeeListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_ShippingFee>,
        private routeService: RouteService,
        private translateService: TranslateService,
        private deliveryService: DeliveryService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'delivery.shippingFee.pickUpCityName',
                name: 'pickUpCityName',
            },
            {
                label: 'delivery.shippingFee.pickUpCityCode',
                name: 'pickUpCityCode',
            },
            {
                label: 'delivery.shippingFee.destinationCityName',
                name: 'destinationCityName',
            },
            {
                label: 'delivery.shippingFee.destinationCityCode',
                name: 'destinationCityCode',
            },
            {
                label: 'delivery.shippingFee.weight',
                name: 'weight',
            },
            {
                label: 'delivery.shippingFee.fee',
                name: 'fee',
            },
            {
                label: 'delivery.shippingFee.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'delivery.shippingFee.active',
                        value: true,
                    },
                    {
                        label: 'delivery.shippingFee.inactive',
                        value: false,
                    },
                ],
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '200px' },
                sort: 'pickUpCityName',
                name: 'pickUpCityName',
                label: 'delivery.shippingFee.pickUpCityName',
                render: (_, __, row) => {
                    return row.pickUpCity.name;
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'pickUpCityCode',
                name: 'pickUpCityCode',
                label: 'delivery.shippingFee.pickUpCityCode',
                render: (_, __, row) => {
                    return row.pickUpCity.stateCode;
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'destinationCityName',
                name: 'destinationCityName',
                label: 'delivery.shippingFee.destinationCityName',
                render: (_, __, row) => {
                    return row.destinationCity.name;
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'destinationCityCode',
                name: 'destinationCityCode',
                label: 'delivery.shippingFee.destinationCityCode',
                render: (_, __, row) => {
                    return row.destinationCity.stateCode;
                },
            },
            {
                cellStyle: { width: '100px' },
                sort: 'weight',
                name: 'weight',
                label: 'delivery.shippingFee.weight',
            },
            {
                cellStyle: { width: '100px' },
                sort: 'fee',
                name: 'fee',
                label: 'delivery.shippingFee.fee',
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'delivery.shippingFee.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                        ${this.translateService.instant(cell ? 'delivery.shippingFee.active' : 'delivery.shippingFee.inactive')}
                    </div>`;
                },
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'update',
                label: 'delivery.shippingFee.update',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_ShippingFee) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getShippingFees;

        this.routeService.onChange(({ hash }) => {
            this.getShippingFee(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getShippingFee();
        this.getShippingFees();
    }

    getShippingFee = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.deliveryService.getShippingFee({
                    id,
                }),
        });
    };

    getShippingFees = async (variables?: I_QueryVariables) => {
        const ShippingFees = await this.deliveryService.getShippingFees(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = ShippingFees.data;
        this.table.state.pagination = ShippingFees.pagination;
    };

    handleSort = (values) => {
        this.table.handleSort({
            ...values,
        });
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
