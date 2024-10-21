import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { UnitOfMeasureDetailComponent } from '#admin/pages/master-data/unit-of-measure/detail/unit-of-measure-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_QueryVariables, I_UnitOfMeasure } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-unit-of-measure-list',
    templateUrl: './unit-of-measure-list.component.html',
    styleUrl: './unit-of-measure-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        UnitOfMeasureDetailComponent,
        RouterModule,
    ],
})
export class UnitOfMeasureListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_UnitOfMeasure>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'masterData.nameEn',
                name: 'nameEn',
            },
            {
                label: 'masterData.nameVi',
                name: 'nameVi',
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
                name: 'translationsEn',
                label: 'masterData.nameEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subName',
                name: 'translationsVi',
                label: 'masterData.nameVi',
                render: (_, __, row) => {
                    return translateData(row, 'vi', 'name');
                },
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
                        onClick: (row: I_UnitOfMeasure) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getUnitOfMeasures;

        this.routeService.onChange(({ hash }) => {
            this.getUnitOfMeasure(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getUnitOfMeasure();
        this.getUnitOfMeasures();
    }

    getUnitOfMeasure = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.masterDataService.getUnitOfMeasure({
                    id,
                }),
        });
    };

    getUnitOfMeasures = async (variables?: I_QueryVariables) => {
        const unitOfMeasures = await this.masterDataService.getUnitOfMeasures(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = unitOfMeasures.data;
        this.table.state.pagination = unitOfMeasures.pagination;
        this.table.state.selection?.clear();
    };

    handleSort = (values) => {
        this.table.handleSort({
            ...values,
            ...(values.orderBy && {
                orderBy: values.orderBy.replace('subName', 'name'),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedUnitOfMeasures = this.table.state.selection.selected;

        const { unitOfMeasureUpdateStatus } = await this.masterDataService.updateUnitOfMeasuresStatus({
            listStatus: selectedUnitOfMeasures.map((unitOfMeasure) => ({
                unitOfMeasureId: unitOfMeasure.id,
                status,
            })),
        });

        if (unitOfMeasureUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(unitOfMeasureUpdateStatus.error?.message);
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
