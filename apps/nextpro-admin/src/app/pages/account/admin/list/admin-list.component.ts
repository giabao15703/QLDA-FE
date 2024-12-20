import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { utc } from 'moment';

import { AccountAdminDetailComponent } from '#admin/pages/account/admin/detail/admin-detail.component';
import { FilterComponent, ImportComponent, LoadingComponent, TableComponent } from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    LoadingService,
    LocalStorageService,
    ModalService,
    NotificationService,
    RestApiService,
    RouteService,
    TableService,
} from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    E_TableColumnType,
    I_Admin,
    I_GroupPermission,
    I_QueryVariables,
    I_UserPermission,
} from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';
import { HttpClient } from '@angular/common/http';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-admin-list',
    templateUrl: './admin-list.component.html',
    styleUrl: './admin-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        AccountAdminDetailComponent,
    ],
})
export class AccountAdminListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Admin>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private accountService: AccountService,
        private localStorageService: LocalStorageService,
        private restApiService: RestApiService,
        private modalService: ModalService,
        private http: HttpClient,
    ) {
        this.table.config.filterForm = [
            {
                label: 'account.admin-accounts.accountID',
                name: 'username',
            },
            {
                label: 'account.admin-accounts.accountName',
                name: 'shortName',
            },
            {
                label: 'account.admin-accounts.accountEmail',
                name: 'email',
            },
            {
                label: 'account.admin-accounts.createdDate',
                name: 'created',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.admin-accounts.validFrom',
                name: 'validFrom',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.admin-accounts.validTo',
                name: 'validTo',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
                min: (formGroup) => {
                    return formGroup.get('validFrom').value
                        ? utc(formGroup.get('validFrom').value).add(1, 'd').format()
                        : '';
                },
            },
            {
                label: 'account.admin-accounts.roles',
                name: 'role',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'trưởng khoa',
                        value: 1,
                    },
                    {
                        label: 'giáo vụ',
                        value: 2,
                    },
                    {
                        label: 'giảng viên',
                        value: 3,
                    },
                ],
            },
            {
                label: 'account.admin-accounts.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'account.admin-accounts.active',
                        value: 1,
                    },
                    {
                        label: 'account.admin-accounts.inactive',
                        value: 2,
                    },
                    {
                        label: 'account.admin-accounts.cancelled',
                        value: 3,
                    },
                    {
                        label: 'account.admin-accounts.pending',
                        value: 4,
                    },
                ],
            },
            {
                label: 'account.admin-accounts.modules',
                name: 'modules',
                loadingName: 'getGroupPermissions',
                fieldType: E_FieldType.SELECT,
                getOptions: () =>
                    this.accountService
                        .getGroupPermissions()
                        .then((res) => res.data.filter((groupPermission) => Boolean(groupPermission.group))),
                mapOption: (item: I_GroupPermission) => ({
                    label: item.group.name,
                    value: item.group.id,
                }),
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
                sort: 'username',
                name: 'username',
                label: 'Tài khoản',
            },
            {
                sort: 'short_name',
                name: 'shortName',
                label: 'Tên Giảng Viên',
            },
            {
                sort: 'email',
                name: 'email',
                label: 'Email',
            },
            {
                sort: 'created',
                name: 'created',
                label: 'Ngày tạo',
                render: formatDate,
            },
            {
                sort: 'role',
                name: 'role',
                label: 'Vị trí công việc',
            },
            // {
            //     name: 'subId',
            //     label: 'account.admin-accounts.subID',
            //     render(_, __, row) {
            //         return row?.usersubstitutionpermissionSet?.edges?.[0]?.node?.user?.username;
            //     },
            // },
            // {
            //     name: 'subName',
            //     label: 'account.admin-accounts.subName',
            //     render(_, __, row) {
            //         return row?.usersubstitutionpermissionSet?.edges?.[0]?.node?.user?.shortName;
            //     },
            // },
            // {
            //     name: 'subEmail',
            //     label: 'account.admin-accounts.subEmail',
            //     render(_, __, row) {
            //         return row?.usersubstitutionpermissionSet?.edges?.[0]?.node?.user?.email;
            //     },
            // },
            // {
            //     name: 'subFrom',
            //     label: 'account.admin-accounts.subFrom',
            //     render(_, __, row) {
            //         return formatDate(row?.usersubstitutionpermissionSet?.edges?.[0]?.node?.validFrom);
            //     },
            // },
            // {
            //     name: 'subTo',
            //     label: 'account.admin-accounts.subTo',
            //     render(_, __, row) {
            //         return formatDate(row?.usersubstitutionpermissionSet?.edges?.[0]?.node?.validTo);
            //     },
            // },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'masterData.actions',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_UserPermission) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getAdmins;

        this.routeService.onChange(({ hash }) => {
            this.getAdmin(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.ACCOUNT.ADMIN.EXPORT;

    ngOnInit() {
        this.getAdmin();
        this.getAdmins();
    }

    getAdmin = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.accountService.getAdmin({
                    id,
                }),
        });
    };

    getAdmins = async (variables?: I_QueryVariables) => {
        const admins = await this.accountService.getAdmins(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = admins.data;
        this.table.state.pagination = admins.pagination;
        this.table.state.selection?.clear();
    };

    handleFilter = (values) => {
        this.table.handleFilter({
            ...values,
            ...(values.created && {
                created: utc(values.created).format(),
            }),
            ...(values.validFrom && {
                validFrom: utc(values.validFrom).format(),
            }),
            ...(values.validTo && {
                validTo: utc(values.validTo).add(86399, 's').format(),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedAdmins = this.table.state.selection.selected;

        const { adminStatusUpdate } = await this.accountService.updateAdminStatus({
            listStatus: selectedAdmins.map((admin) => ({
                adminId: admin.id,
                status,
            })),
        });

        if (adminStatusUpdate.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(adminStatusUpdate.error?.message);
        }

        this.modalService.hide();
    };
    selectedFile: File | null = null;

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    uploadFile() {
        if (!this.selectedFile) {
            alert('Vui lòng chọn file!');
            return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        const headers = { 'X-CSRFToken': this.getCsrfToken() };

        this.http.post('http://localhost:8000/api/import-admins/', formData, { headers }).subscribe(
            (response: any) => {
                console.log('Response:', response); // Log phản hồi từ server để kiểm tra

                if (response && response.status === 'success') {
                    this.notificationService.success(response.message || 'File đã được upload thành công!');
                } else if (response && response.status === 'error') {
                    // Nếu không import được tài khoản nào
                    if (response.message.includes('Không có tài khoản nào được import')) {
                        this.notificationService.error(response.message || 'Tất cả tài khoản đã tồn tại!');
                    } else {
                        this.notificationService.error(response.message || 'Đã xảy ra lỗi khi upload file!');
                    }
                } else {
                    console.error('Unexpected response format:', response);
                    this.notificationService.error('Đã xảy ra lỗi khi upload file!');
                }
            },
            (error) => {
                console.error('Error during file upload:', error); // Log chi tiết lỗi
                this.notificationService.error('Đã xảy ra lỗi khi upload file!');
            },
        );
    }

    getCsrfToken(): string {
        const match = document.cookie.match(/csrftoken=([\w-]+)/);
        return match ? match[1] : '';
    }

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
