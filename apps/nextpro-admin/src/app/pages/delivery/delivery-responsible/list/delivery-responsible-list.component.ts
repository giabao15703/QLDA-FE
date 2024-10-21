import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, ImportComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { DeliveryService, LoadingService, RouteService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_DeliveryResponsible, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { DeliveryResponsibleDetailComponent } from '../detail/delivery-responsible-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-delivery-responsible-list',
    templateUrl: './delivery-responsible-list.component.html',
    styleUrl: './delivery-responsible-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        DeliveryResponsibleDetailComponent,
    ],
})
export class AdminDeliveryResponsibleListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_DeliveryResponsible>,
        private routeService: RouteService,
        private translateService: TranslateService,
        private deliveryService: DeliveryService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'delivery.deliveryResponsible.transporterCode',
                name: 'transporterCode',
            },
            {
                label: 'delivery.deliveryResponsible.transporterShortName',
                name: 'transporterShortName',
            },
            {
                label: 'delivery.deliveryResponsible.cityCode',
                name: 'cityCode',
            },
            {
                label: 'delivery.deliveryResponsible.cityName',
                name: 'cityName',
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '100px' },
                sort: 'transporterCode',
                name: 'transporterCode',
                label: 'delivery.deliveryResponsible.code',
                render: (cell) => {
                    return cell.code;
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'transporterShortName',
                name: 'transporterShortName',
                label: 'delivery.deliveryResponsible.transporterShortName',
                render: (_, __, row) => {
                    return row.transporterCode.shortName;
                },
            },
            {
                cellStyle: { width: '100px' },
                sort: 'cityCode',
                name: 'cityCode',
                label: 'delivery.deliveryResponsible.cityCode',
                render: (cell) => {
                    return cell.stateCode;
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'cityName',
                name: 'cityName',
                label: 'delivery.deliveryResponsible.cityName',
                render: (_, __, row) => {
                    return row.cityCode.name;
                },
            },
            {
                cellStyle: { width: '100px' },
                sort: 'effectiveDate',
                name: 'effectiveDate',
                label: 'delivery.deliveryResponsible.update',
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'delivery.deliveryResponsible.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                        ${this.translateService.instant(cell ? 'delivery.deliveryResponsible.active' : 'delivery.deliveryResponsible.inactive')}
                    </div>`;
                },
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'delivery.deliveryResponsible.action',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_DeliveryResponsible) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getDeliveryResponsibles;

        this.routeService.onChange(({ hash }) => {
            this.getDeliveryResponsible(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getDeliveryResponsible();
        this.getDeliveryResponsibles();
    }

    getDeliveryResponsible = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.deliveryService.getDeliveryResponsible({
                    id,
                }),
        });
    };

    getDeliveryResponsibles = async (variables?: I_QueryVariables) => {
        const deliveryResponsibles = await this.deliveryService.getDeliveryResponsibles(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = deliveryResponsibles.data;
        this.table.state.pagination = deliveryResponsibles.pagination;
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
