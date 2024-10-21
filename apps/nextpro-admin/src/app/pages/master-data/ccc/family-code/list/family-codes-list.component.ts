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
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_FamilyCode, I_QueryVariables } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';
import { FamilyCodeDetailComponent } from '../detail/family-code-detail.component';

const TAB_NAME = 'family';

@Component({
    standalone: true,
    selector: 'nextpro-admin-family-codes-list',
    templateUrl: './family-codes-list.component.html',
    styleUrl: './family-codes-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        FamilyCodeDetailComponent,
    ],
})
export class FamilyCodeListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_FamilyCode>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
        private localStorageService: LocalStorageService,
        private restApiService: RestApiService,
    ) {
        this.table.config.filterForm = [
            {
                wrapperClass: 'w-[250px]',
                label: 'masterData.familyCodeNameEn',
                name: 'name',
            },
            {
                label: 'masterData.familyCodeNameVi',
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
                name: 'FamilyCodeNameEn',
                label: 'masterData.familyCodeNameEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subName',
                name: 'FamilyCodeNameVi',
                label: 'masterData.familyCodeNameVi',
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
                        onClick: (row: I_FamilyCode) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getFamilyCodes;

        this.routeService.onChange(({ hash }) => {
            this.getFamilyCode(hash);
        });
    }

    detail = null;
    import = null;
    importUrl = REST_API_ADMIN_ENDPOINTS.MASTER_DATA.CCC.FAMILY_CODE.IMPORT;
    exportUrl = REST_API_ADMIN_ENDPOINTS.MASTER_DATA.CCC.FAMILY_CODE.EXPORT;

    ngOnInit() {
        this.getFamilyCode();
        this.getFamilyCodes();
    }

    getFamilyCode = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.masterDataService.getFamilyCode({
                    id,
                }),
        });
    };

    getFamilyCodes = async (variables?: I_QueryVariables) => {
        const familyCodes = await this.masterDataService.getFamilyCodes(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = familyCodes.data;
        this.table.state.pagination = familyCodes.pagination;
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
        const selectedCities = this.table.state.selection.selected;

        const { familyCodeUpdateStatus } = await this.masterDataService.updateFamilyCodeStatus({
            listStatus: selectedCities.map((familyCode) => ({
                familyCodeId: familyCode.id,
                status,
            })),
        });

        if (familyCodeUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(familyCodeUpdateStatus.error?.message);
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
            FileSaver.saveAs(result.body, 'master_data_ccc_family_codes.csv');
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
