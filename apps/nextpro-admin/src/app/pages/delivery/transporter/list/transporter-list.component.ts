import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, ImportComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { DeliveryService, LoadingService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_QueryVariables, I_Transporter } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { TransporterDetailComponent } from '../detail/transporter-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-transporter-list',
    templateUrl: './transporter-list.component.html',
    styleUrl: './transporter-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        TransporterDetailComponent,
    ],
})
export class AdminDeliveryTransporterListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Transporter>,
        private routeService: RouteService,
        private translateService: TranslateService,
        private deliveryService: DeliveryService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'delivery.transporterList.transporterShortName',
                name: 'shortName',
            },
            {
                label: 'delivery.transporterList.transporterLongName',
                name: 'longName',
            },
            {
                label: 'delivery.transporterList.code',
                name: 'code',
            },
            {
                label: 'delivery.transporterList.tax',
                name: 'tax',
            },
            {
                label: 'delivery.transporterList.address',
                name: 'address',
            },
            {
                label: 'delivery.transporterList.email',
                name: 'email',
            },
            {
                label: 'delivery.transporterList.phone',
                name: 'phone',
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
                cellStyle: { width: '200px' },
                sort: 'shortName',
                name: 'shortName',
                label: 'delivery.transporterList.transporterShortName',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'longName',
                name: 'longName',
                label: 'delivery.transporterList.transporterLongName',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'code',
                name: 'code',
                label: 'delivery.transporterList.code',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'tax',
                name: 'tax',
                label: 'delivery.transporterList.tax',
            },
            {
                cellStyle: { width: '100px' },
                sort: 'address',
                name: 'address',
                label: 'delivery.transporterList.address',
            },
            {
                cellStyle: { width: '100px' },
                sort: 'email',
                name: 'email',
                label: 'delivery.transporterList.email',
            },
            {
                cellStyle: { width: '100px' },
                sort: 'phone',
                name: 'phone',
                label: 'delivery.transporterList.phone',
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'delivery.transporterList.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                        ${this.translateService.instant(cell ? 'delivery.transporterList.active' : 'delivery.transporterList.inactive')}
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
                        onClick: (row: I_Transporter) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getTransporters;

        this.routeService.onChange(({ hash }) => {
            this.getTransporter(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getTransporter();
        this.getTransporters();
    }

    getTransporter = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.deliveryService.getTransporter({
                    id,
                }),
        });
    };

    getTransporters = async (variables?: I_QueryVariables) => {
        const TransporterLists = await this.deliveryService.getTransporters(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = TransporterLists.data;
        this.table.state.pagination = TransporterLists.pagination;
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
