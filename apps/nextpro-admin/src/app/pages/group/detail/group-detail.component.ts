import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { formatDate, getQueryVariables } from '#shared/utils';
import {
    AccountService,
    AuthService,
    FormService,
    GroupQLDAService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    OrderService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_GroupQLDA, I_JoinGroup, I_QueryVariables } from '#shared/types';
import { AdminInfoFragmentDoc } from '#shared/graphql/types';

const FORM_NAME = 'FORM_ADMIN_DELIVERY_GROUP_STUDENT';

@Component({
    standalone: true,
    selector: 'nextpro-admin-group-detail',
    templateUrl: './group-detail.component.html',
    styleUrl: './group-detail.component.scss',
    providers: [TableService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent, TableComponent],
})
export class GroupDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_JoinGroup>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private groupQLDAService: GroupQLDAService,
        private accountService: AccountService,
        private authService: AuthService,
    ) {
        this.table.config.columns = [
            {
                name: 'user.shortName',
                label: 'Tên thành viên',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                name: 'user.lop',
                label: 'Lớp',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                name: 'user.email',
                label: 'Email',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                name: 'user.phone',
                label: 'Số điện thoại',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                name: 'role',
                label: 'Chức vụ',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'banner.action',
                ctas: [
                    {
                        icon: 'delete',
                        onClick: (row: I_JoinGroup) => {
                            this.deleteMember(row);
                        },
                    },
                ],
            },
        ];

        this.table.config.refetch = this.getJoinGroups;
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_GroupQLDA;
    @Input() onCloseDrawer;
    @Input() refetch;

    ngOnInit() {
        this.getJoinGroups();
        const oldData = this.localStorageService.get(FORM_NAME);

        // if (oldData) {
        //     this.form.patchValue(oldData);
        // }
    }

    getJoinGroups = async (variables?: I_QueryVariables) => {
        const joinGroups = await this.groupQLDAService.getJoinGroups(
            {
                ...getQueryVariables({
                    variables: {
                        ...variables,
                        groupId: this.data.id,
                    },
                }),
            },
            { extra: { variables } },
        );

        this.table.state.data = joinGroups.data;
        this.table.state.pagination = joinGroups.pagination;
        this.table.state.selection?.clear();
    };

    ngOnChanges(changes) {
        if (this.data) {
            console.log(this.data);
        }
    }
    handleSave = async () => {};

    deleteMember = async (row: I_JoinGroup) => {

        const currentUser = localStorage.getItem('admin');
        const user = JSON.parse(currentUser);
        if (user.role !== 'A_2') {
            this.notificationService.error('Bạn không có quyền xóa thành viên!');
            return;
        }

        let confirmDelete;
        if (this.table.state.data.length === 1 && row.role === 'leader') {
            confirmDelete = confirm(
                `Nhóm hiện chỉ còn leader (${row.user.shortName}). Bạn có muốn xóa cả nhóm thay vì xóa thành viên này không?`,
            );
        } else {
            confirmDelete = confirm(`Bạn có chắc chắn muốn xóa thành viên ${row.user.shortName} khỏi nhóm không?`);
        }

        // Nếu nhóm không phải thành viên cuối cùng hoặc không phải leader
        if (!confirmDelete) {
            return;
        }

        try {
            this.loadingService.show(); // Hiển thị loading
            const { deleteMemberFromGroup } = await this.groupQLDAService.deleteMember({
                groupId: this.data.id,
                userId: row.user.id,
            });

            if (deleteMemberFromGroup.status) {
                this.notificationService.success(deleteMemberFromGroup.error?.message);
                if (this.table.state.data.length === 1) {
                    this.onCloseDrawer();
                    if (this.refetch) {
                        this.refetch(); // Gọi refetch để làm mới danh sách ở GroupListPage
                    }
                } else {
                    this.getJoinGroups(); // Làm mới danh sách thành viên trong nhóm
                }
            } else {
                this.notificationService.error(deleteMemberFromGroup.error?.message);
            }
        } catch (error) {
            console.error(error);
            this.notificationService.error('Có lỗi xảy ra khi xóa thành viên!');
        } finally {
            this.loadingService.hide(); // Tắt loading
        }
    };
}
