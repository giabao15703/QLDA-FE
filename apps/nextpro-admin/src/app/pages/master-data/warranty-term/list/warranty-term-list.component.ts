import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_QueryVariables, I_WarrantyTerm } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';
import { WarrantyTermDetailComponent } from '../detail/warranty-term-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-warranty-term-list',
    templateUrl: './warranty-term-list.component.html',
    styleUrl: './warranty-term-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        WarrantyTermDetailComponent,
        FilterComponent,
        RouterModule,
    ],
})
export class WarrantyTermListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_WarrantyTerm>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'warrantyTerm.code',
                name: 'warrantyCode',
            },
            {
                label: 'voucher.descriptionEN',
                name: 'nameEn',
            },
            {
                label: 'voucher.descriptionVN',
                name: 'nameVi',
            },

            {
                label: 'voucher.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'voucher.active',
                        value: true,
                    },
                    {
                        label: 'voucher.inactive',
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
                cellStyle: { width: '70px' },
                name: 'warrantyCode',
                label: 'warrantyTerm.code',
            },
            {
                sort: 'nameEn',
                name: 'nameEn',
                label: 'voucher.descriptionEN',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                },
            },
            {
                sort: 'nameVi',
                name: 'nameVi',
                label: 'voucher.descriptionVN',
                render: (_, __, row) => {
                    return translateData(row, 'vi', 'name');
                },
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
                        onClick: (row: I_WarrantyTerm) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getWarrantyTerms;

        this.routeService.onChange(({ hash }) => {
            this.getWarrantyTerm(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getWarrantyTerm();
        this.getWarrantyTerms();
    }

    getWarrantyTerm = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.masterDataService.getWarrantyTerm({
                    id,
                }),
        });
    };

    getWarrantyTerms = async (variables?: I_QueryVariables) => {
        const warranties = await this.masterDataService.getWarrantyTerms(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = warranties.data;
        this.table.state.pagination = warranties.pagination;
        this.table.state.selection?.clear();
    };

    handleUpdateStatus = async (status) => {
        const selectedCoupons = this.table.state.selection.selected;

        const { warrantyTermUpdateStatus } = await this.masterDataService.updateWarrantyTermStatus({
            listStatus: selectedCoupons.map((warrantyTerm) => ({
                warrantyTermId: warrantyTerm.id,
                status,
            })),
        });

        if (warrantyTermUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(warrantyTermUpdateStatus.error?.message);
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
