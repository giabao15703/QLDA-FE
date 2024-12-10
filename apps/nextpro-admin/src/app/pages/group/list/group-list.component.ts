import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, ImportComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    DeliveryService,
    GroupQLDAService,
    LoadingService,
    OrderService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_GroupQLDA, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { GroupDetailComponent } from '../../group/detail/group-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-group-list',
    templateUrl: './group-list.component.html',
    styleUrl: './group-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        GroupDetailComponent,
    ],
})
export class GroupListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_GroupQLDA>,
        private routeService: RouteService,
        private translateService: TranslateService,
        private GroupService: GroupQLDAService,
    ) {
        this.table.config.filterForm = [];

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
                sort: 'maNhom',
                name: 'maNhom',
                label: 'Mã nhóm',
            },
            {
                sort: 'tenDeTai',
                name: 'tenDeTai',
                label: 'Tên đề tài',
                render: (_, __, row) => {
                    console.log(row.deTai?.tendoan);
                    return row.deTai?.tendoan;
                },
            },
            {
                sort: 'memberCount',
                name: 'memberCount',
                label: 'Members',
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'Status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                        ${this.translateService.instant(cell ? 'Active' : 'Inactive')}
                    </div>`;
                },
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'update',
                label: 'Update',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_GroupQLDA) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];

        this.table.config.refetch = this.getGroupQldas;

        this.routeService.onChange(({ hash }) => {
            this.getGroupQlda(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getGroupQlda();
        this.getGroupQldas();
    }

    getGroupQlda = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.GroupService.getGroupQlda({
                    id,
                }),
        });
    };
    getGroupQldas = async (variables?: I_QueryVariables) => {
        const currentUser = localStorage.getItem('user');
        const currentAdmin = localStorage.getItem('admin');
        const user = JSON.parse(currentUser);
        const admin = JSON.parse(currentAdmin);
        const groupQldas = await this.GroupService.getGroupQldas(
            {
                ...getQueryVariables({
                    variables: {
                        ...variables,
                        idgvhuongdan: admin.role === 'A_2' ? undefined : user.id,
                    },
                }),
            },
            { extra: { variables } },
        );
        this.table.state.data = groupQldas.data;
        this.table.state.pagination = groupQldas.pagination;
        this.table.state.selection?.clear();
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
