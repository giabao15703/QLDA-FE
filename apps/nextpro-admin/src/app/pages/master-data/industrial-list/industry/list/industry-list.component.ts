import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Industry, I_QueryVariables } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';
import { IndustryDetailComponent } from '../detail/industry-detail.component';

const TAB_NAME = 'main';

@Component({
    standalone: true,
    selector: 'nextpro-admin-industry-list',
    templateUrl: './industry-list.component.html',
    styleUrl: './industry-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        IndustryDetailComponent,
        RouterModule,
    ],
})
export class IndustryListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Industry>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'masterData.IndustryNameEn',
                name: 'name',
            },
            {
                label: 'masterData.IndustryNameVi',
                name: 'nameVi',
            },
            {
                label: 'masterData.code',
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
                name: 'IndustryNameEn',
                label: 'masterData.IndustryNameEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subName',
                name: 'IndustryNameVi',
                label: 'masterData.IndustryNameVi',
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
                        onClick: (row: I_Industry) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getIndustries;

        this.routeService.onChange(({ hash }) => {
            this.getIndustry(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getIndustry();
        this.getIndustries();
    }

    getIndustry = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.masterDataService.getIndustry({
                    id,
                }),
        });
    };

    getIndustries = async (variables?: I_QueryVariables) => {
        const industries = await this.masterDataService.getIndustries(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = industries.data;
        this.table.state.pagination = industries.pagination;
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
        const selectedIndustries = this.table.state.selection.selected;

        const { industryUpdateStatus } = await this.masterDataService.updateIndustryStatus({
            listStatus: selectedIndustries.map((industry) => ({
                industryId: industry.id,
                status,
            })),
        });

        if (industryUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(industryUpdateStatus.error?.message);
        }
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE, prefix: TAB_NAME });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
