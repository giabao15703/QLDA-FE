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
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Category, I_QueryVariables } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';
import { CategoryDetailComponent } from '../detail/description-code-detail.component';

const TAB_NAME = 'description';

@Component({
    standalone: true,
    selector: 'nextpro-admin-description-code-list',
    templateUrl: './description-code-list.component.html',
    styleUrl: './description-code-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        CategoryDetailComponent,
    ],
})
export class CategoryListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Category>,
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
                label: 'masterData.descriptionCodeNameEn',
                name: 'name',
            },
            {
                label: 'masterData.descriptionCodeNameVi',
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
                name: 'subClusterCodeNameEn',
                label: 'masterData.subClusterCodeNameEn',
                render: (_, __, row) => {
                    return translateData(row.subClusterCode, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subParentName',
                name: 'subClusterCodeNameVi',
                label: 'masterData.subClusterCodeNameVi',
                render: (_, __, row) => {
                    return translateData(row.subClusterCode, 'vi', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                name: 'name',
                sort: 'descriptionCodeNameEn',
                label: 'masterData.descriptionCodeNameEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subName',
                name: 'descriptionCodeNameVi',
                label: 'masterData.descriptionCodeNameVi',
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
                        onClick: (row: I_Category) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getCategoriesWithSubClusterCode;

        this.routeService.onChange(({ hash }) => {
            this.getCategoryWithSubClusterCode(hash);
        });
    }

    detail = null;
    import = null;
    importUrl = REST_API_ADMIN_ENDPOINTS.MASTER_DATA.CCC.DESCRIPTION_CODE.IMPORT;
    exportUrl = REST_API_ADMIN_ENDPOINTS.MASTER_DATA.CCC.DESCRIPTION_CODE.EXPORT;

    ngOnInit() {
        this.getCategoryWithSubClusterCode();
        this.getCategoriesWithSubClusterCode();
    }

    getCategoryWithSubClusterCode = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.masterDataService.getCategoryWithSubClusterCode({
                    id,
                }),
        });
    };

    getCategoriesWithSubClusterCode = async (variables?: I_QueryVariables) => {
        const categoriesWithSubClusterCode = await this.masterDataService.getCategoriesWithSubClusterCode(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = categoriesWithSubClusterCode.data;
        this.table.state.pagination = categoriesWithSubClusterCode.pagination;
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
        const selectedCategories = this.table.state.selection.selected;

        const { categoryUpdateStatus } = await this.masterDataService.updateCategoryStatus({
            listStatus: selectedCategories.map((category) => ({
                categoryId: category.id,
                status,
            })),
        });

        if (categoryUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(categoryUpdateStatus.error?.message);
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
            FileSaver.saveAs(result.body, 'master_data_ccc_description_codes.csv');
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
