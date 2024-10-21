import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { FilterComponent, ImportComponent, LoadingComponent, TableComponent } from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    RestApiService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_QueryVariables, I_SubClusterCode } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';
import { SubClusterCodeDetailComponent } from '../detail/sub-cluster-code-detail.component';

const TAB_NAME = 'subcluster';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sub-cluster-code-list',
    templateUrl: './sub-cluster-code-list.component.html',
    styleUrl: './sub-cluster-code-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        SubClusterCodeDetailComponent,
    ],
})
export class SubClusterCodeListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_SubClusterCode>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
        private localStorageService: LocalStorageService,
        private restApiService: RestApiService,
    ) {
        this.table.config.filterForm = [
            {
                wrapperClass: 'w-[300px]',
                label: 'masterData.subClusterCodeNameEn',
                name: 'name',
            },
            {
                label: 'masterData.subClusterCodeNameVi',
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
                sort: 'parent_name',
                name: 'clusterCodeNameEn',
                label: 'masterData.clusterCodeNameEn',
                render: (_, __, row) => {
                    return translateData(row.clusterCode, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subParentName',
                name: 'clusterCodeNameVi',
                label: 'masterData.clusterCodeNameVi',
                render: (_, __, row) => {
                    return translateData(row.clusterCode, 'vi', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'name',
                name: 'subClusterCodeNameEn',
                label: 'masterData.subClusterCodeNameEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subName',
                name: 'subClusterCodeNameVi',
                label: 'masterData.subClusterCodeNameVi',
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
                        onClick: (row: I_SubClusterCode) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getSubClusterCodesWithClusterCode;

        this.routeService.onChange(({ hash }) => {
            this.getSubClusterCodeWithClusterCode(hash);
        });
    }

    detail = null;
    import = null;
    importUrl = REST_API_ADMIN_ENDPOINTS.MASTER_DATA.CCC.SUB_CLUSTER_CODE.IMPORT;
    exportUrl = REST_API_ADMIN_ENDPOINTS.MASTER_DATA.CCC.SUB_CLUSTER_CODE.EXPORT;

    ngOnInit() {
        this.getSubClusterCodeWithClusterCode();
        this.getSubClusterCodesWithClusterCode();
    }

    getSubClusterCodeWithClusterCode = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.masterDataService.getSubClusterCodeWithClusterCode({
                    id,
                }),
        });
    };

    getSubClusterCodesWithClusterCode = async (variables?: I_QueryVariables) => {
        const subClusterCodesWithClusterCode = await this.masterDataService.getSubClusterCodesWithClusterCode(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = subClusterCodesWithClusterCode.data;
        this.table.state.pagination = subClusterCodesWithClusterCode.pagination;
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
        const selectedSubClusterCodes = this.table.state.selection.selected;

        const { subClusterCodeUpdateStatus } = await this.masterDataService.updateSubClusterCodeStatus({
            listStatus: selectedSubClusterCodes.map((subClusterCode) => ({
                subClusterCodeId: subClusterCode.id,
                status,
            })),
        });

        if (subClusterCodeUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(subClusterCodeUpdateStatus.error?.message);
        }
    };

    handleImport = () => {
        this.import = {};
    };

    handleCloseImportDrawer = () => {
        this.import = null;
    };

    handleExport = async () => {
        const { name, itemCode_Icontains } = this.table.query.filter;

        const result = await this.restApiService.post(
            this.exportUrl,
            {
                ...(name && { searchName: name }),
                ...(itemCode_Icontains && { searchCode: itemCode_Icontains }),
            },
            {
                responseType: 'blob',
                observe: 'response',
                headers: {
                    Authorization: `Token ${this.localStorageService.get('token')}`,
                },
            },
        );

        if (result.status === 200) {
            FileSaver.saveAs(result.body, 'master_data_ccc_sub_cluster_codes.csv');
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
