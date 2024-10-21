import { getQueryVariables, translateData } from '#shared/utils';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_IndustryCluster, I_QueryVariables } from '#shared/types';
import { IndustryClusterDetailComponent } from '../detail/industry-cluster-detail.component';

const TAB_NAME = 'cluster';

@Component({
    standalone: true,
    selector: 'nextpro-admin-industry-cluster-list',
    templateUrl: './industry-cluster-list.component.html',
    styleUrl: './industry-cluster-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        IndustryClusterDetailComponent,
        RouterModule,
    ],
})
export class IndustryClusterListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_IndustryCluster>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                wrapperClass: 'w-[250px]',
                label: 'masterData.industryClusterNameEn',
                name: 'name',
            },
            {
                label: 'masterData.industryClusterNameVi',
                name: 'nameVi',
            },
            {
                label: 'masterData.code',
                name: 'itemCode_Icontains',
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
                sort: 'parentName',
                name: 'industryNameEn',
                label: 'masterData.industryNameEn',
                render: (_, __, row) => {
                    return translateData(row.industry, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subParentName',
                name: 'industryNameVi',
                label: 'masterData.industryNameVi',
                render: (_, __, row) => {
                    return translateData(row.industry, 'vi', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'name',
                name: 'industryClusterNameEn',
                label: 'masterData.industryClusterNameEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subName',
                name: 'industryClusterNameVi',
                label: 'masterData.industryClusterNameVi',
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
                        onClick: (row: I_IndustryCluster) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getIndustryClustersWithIndustry;

        this.routeService.onChange(({ hash }) => {
            this.getIndustryClusterWithIndustry(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getIndustryClusterWithIndustry();
        this.getIndustryClustersWithIndustry();
    }

    getIndustryClusterWithIndustry = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.masterDataService.getIndustryClusterWithIndustry({
                    id,
                }),
        });
    };

    getIndustryClustersWithIndustry = async (variables?: I_QueryVariables) => {
        const industryClustersWithIndustry = await this.masterDataService.getIndustryClustersWithIndustry(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = industryClustersWithIndustry.data;
        this.table.state.pagination = industryClustersWithIndustry.pagination;
        this.table.state.selection?.clear();
    };

    handleSort = (values) => {
        this.table.handleSort({
            ...values,
            ...(values.orderBy && {
                orderBy: values.orderBy.replace('subName', 'name').replace('subParentName', 'parent_name'),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedIndustryClusters = this.table.state.selection.selected;

        const { industryClusterUpdateStatus } = await this.masterDataService.updateIndustryClusterStatus({
            listStatus: selectedIndustryClusters.map((industryCluster) => ({
                industryClusterId: industryCluster.id,
                status,
            })),
        });

        if (industryClusterUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(industryClusterUpdateStatus.error?.message);
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
