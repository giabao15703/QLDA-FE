/* /* import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, ImportComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { DeliveryService, LoadingService, OrderService, RouteService, TableService } from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_TableColumnType,
    I_GroupStudent,
    I_QueryVariables,
    I_ShippingFee,
} from '#shared/types';
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
export class GroupListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_GroupStudent>,
        private routeService: RouteService,
        private translateService: TranslateService,
        private deliveryService: DeliveryService,
        private orderService: OrderService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'Name',
                name: 'nameGroup', // Update to match the correct field in GroupStudent
            },
            {
                label: 'Student',
                name: 'members.fullName', // Update to match the detail structure
            },
            {
                label: 'Giang Vien',
                name: 'giangVien.nameGiangVien', // Update to match the correct field for GiangVien
            },
            {
                label: 'Status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'Active',
                        value: true,
                    },
                    {
                        label: 'Inactive',
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
                sort: 'nameGroup',
                name: 'nameGroup',
                label: 'Name',
            },
            {
                sort: 'members',
                name: 'members',
                label: 'Members',
                render: (row) => {
                    return row.members.map((member) => member.fullName).join(', ');
                },
            },
            {
                sort: 'giangVien',
                name: 'giangVien',
                label: 'GiangVien',
                render: (_, __, row) => {
                    return row.giangVien?.nameGiangVien || 'N/A';
                },
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
                        onClick: (row: I_GroupStudent) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];

        this.table.config.refetch = this.getGroupStudents; 

        this.routeService.onChange(({ hash }) => {
            this.getGroupStudent(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getGroupStudent();
        this.getGroupStudents(); 
    }

    getGroupStudent = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.orderService.getGroupStudent({
                    id,
                }),
        });
    };
     getGroupStudents = async (nameGroup?: string, members?: string, giangVienName?: string, status?: boolean) => {
        const groupStudents = {
            nameGroup: nameGroup || null, 
            members: members || [],
            giangVien: giangVienName || null,
            status: status || null,
        };

        this.table.state.data = [groupStudents]; // Thay
        this.table.state.pagination = { totalCount: 1 };
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
} */
