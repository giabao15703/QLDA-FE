import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_TableColumnType,
    I_QueryVariables,
    I_SetProductAdvertisement,
} from '#shared/types';
import { formatMoney, getQueryVariables, translateData } from '#shared/utils';
import { SetProductAdvertisementDetailComponent } from '../detail/set-product-advertisement-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-set-product-advertisement-list',
    templateUrl: './set-product-advertisement-list.component.html',
    styleUrl: './set-product-advertisement-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        SetProductAdvertisementDetailComponent,
        FilterComponent,
        RouterModule,
    ],
})
export class SetProductAdvertisementListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_SetProductAdvertisement>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataSerVice: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'voucher.descriptionEN',
                name: 'descriptionEn',
            },
            {
                label: 'voucher.descriptionVN',
                name: 'descriptionVi',
            },
            {
                label: 'setProductAdvertiment.duration',
                name: 'duration',
            },
            {
                label: 'setProductAdvertiment.serviceFee',
                name: 'serviceFee',
            },
            {
                label: 'voucher.status',
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
                type: E_TableColumnType.SELECTION,
                name: 'selection',
            },
            {
                cellStyle: { width: '50px' },
                name: 'no',
                label: 'banner.no',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                sort: 'description',
                name: 'descriptionEn',
                label: 'voucher.descriptionEN',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'description');
                },
            },
            {
                sort: 'description',
                name: 'descriptionVi',
                label: 'voucher.descriptionVN',
                render: (_, __, row) => {
                    return translateData(row, 'vi', 'description');
                },
            },
            {
                sort: 'duration',
                name: 'duration',
                label: 'setProductAdvertiment.duration',
            },
            {
                sort: 'serviceFee',
                name: 'serviceFee',
                label: 'setProductAdvertiment.serviceFee',
                render: formatMoney,
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'coupon.status',
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
                        onClick: (row: I_SetProductAdvertisement) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getSetProductAdvertisements;

        this.routeService.onChange(({ hash }) => {
            this.getSetProductAdvertisement(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getSetProductAdvertisement();
        this.getSetProductAdvertisements();
    }

    getSetProductAdvertisement = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.masterDataSerVice.getSetProductAdvertisement({
                    id,
                }),
        });
    };

    getSetProductAdvertisements = async (variables?: I_QueryVariables) => {
        const setProductAdvertisements = await this.masterDataSerVice.getSetProductAdvertisements(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = setProductAdvertisements.data;
        this.table.state.pagination = setProductAdvertisements.pagination;
        this.table.state.selection?.clear();
    };

    handleUpdateStatus = async (status) => {
        const selectedSetProductAdvertisements = this.table.state.selection.selected;

        const { setProductAdvertisementUpdateStatus } =
            await this.masterDataSerVice.updateSetProductAdvertisementStatus({
                listStatus: selectedSetProductAdvertisements.map((setProductAdvertisement) => ({
                    setProductAdvertisementId: setProductAdvertisement.id,
                    status,
                })),
            });

        if (setProductAdvertisementUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(setProductAdvertisementUpdateStatus.error?.message);
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
