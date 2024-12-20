import { CommonModule, formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { utc } from 'moment';

import {
    FilterComponent,
    ImportComponent,
    LoadingComponent,
    StatusUpdateComponent,
    TableComponent,
} from '#shared/components';
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
    SaleSchemeService,
    TableService,
} from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    E_TableColumnType,
    I_Buyer,
    I_ProfileFeaturesBuyer,
    I_QueryVariables,
} from '#shared/types';
import { AccountBuyerMainAccountDetailComponent } from '../main-account-detail/main-account-detail.component';
import { getQueryVariables } from '#shared/utils';
import { HttpClient } from '@angular/common/http';

const TAB_NAME = 'main';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-buyer-main-account-list',
    templateUrl: './main-account-list.component.html',
    styleUrl: './main-account-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        AccountBuyerMainAccountDetailComponent,
    ],
})
export class AccountBuyerMainAccountListComponent {
    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Buyer>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private accountService: AccountService,
        private saleSchemeService: SaleSchemeService,
        private localStorageService: LocalStorageService,
        private restApiService: RestApiService,
        private modalService: ModalService,
        private http: HttpClient,
    ) {
        this.table.config.filterForm = [
            {
                label: 'account.buyer-accounts.buyer-accounts-list.accountID',
                name: 'username',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.accountEmail',
                name: 'email',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.createdDate',
                name: 'created',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.validFrom',
                name: 'validFrom',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.validTo',
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
                label: 'account.buyer-accounts.buyer-accounts-list.profileFeatures',
                name: 'profileFeature',
                loadingName: 'getProfileFeaturesBuyer',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.saleSchemeService.getProfileFeaturesBuyer().then((res) => res.data),
                mapOption: (item: I_ProfileFeaturesBuyer) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.auctionsYear',
                name: 'auctionsYear',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.rfxCancellation',
                name: 'rfxCancel',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'account.buyer-accounts.buyer-accounts-list.active',
                        value: 1,
                    },
                    {
                        label: 'account.buyer-accounts.buyer-accounts-list.inactive',
                        value: 2,
                    },
                    {
                        label: 'account.buyer-accounts.buyer-accounts-list.cancelled',
                        value: 3,
                    },
                    {
                        label: 'account.buyer-accounts.buyer-accounts-list.pending',
                        value: 4,
                    },
                ],
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.changedBy',
                name: 'changedBy',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.changeDate',
                name: 'changedDate',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.reasonInManual',
                name: 'reasonManual',
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
                sort: 'mssv',
                name: 'mssv',
                label: 'MSSV',
            },
            {
                sort: 'mssv',
                name: 'shortName',
                label: 'Tên',
            },
            {
                sort: 'username',
                name: 'username',
                label: 'Tài khoản',
            },
            {
                sort: 'gender',
                name: 'gender',
                label: 'Giới tính',
            },
            {
                sort: 'phone',
                name: 'phone',
                label: 'Số điện thoại',
            },
            {
                cellStyle: { 'max-width': '150px', overflow: 'hidden', 'text-overflow': 'ellipsis' },
                sort: 'picture',
                name: 'picture',
                label: 'Ảnh',
            },
            {
                sort: 'email',
                name: 'email',
                label: 'account.buyer-accounts.buyer-accounts-list.accountEmail',
            },
            {
                sort: 'created',
                name: 'created',
                label: 'account.buyer-accounts.buyer-accounts-list.createdDate',
                render: (cell) => formatDate(cell, 'mediumDate', 'en-US'),
            },
            {
                sort: 'ngaySinh',
                name: 'ngaySinh',
                label: 'Ngày sinh',
                render: (cell) => formatDate(cell, 'mediumDate', 'en-US'),
            },
            {
                sort: 'noiSinh',
                name: 'noiSinh',
                label: 'Nơi sinh',
            },
            {
                sort: 'lop',
                name: 'lop',
                label: 'Lớp',
            },
            {
                sort: 'khoaHoc',
                name: 'khoaHoc',
                label: 'Khóa học',
            },
            {
                sort: 'loaiHinhDaoTao',
                name: 'loaiHinhDaoTao',
                label: 'Loại hình đào tạo',
            },
            {
                sort: 'bacDaoTao',
                name: 'bacDaoTao',
                label: 'Bậc đào tạo',
            },
            {
                sort: 'nganh',
                name: 'nganh',
                label: 'Ngành',
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.EXPAND,
                name: 'expand',
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
                        onClick: (row: I_Buyer) => {
                            console.log('Dữ liệu dòng khi nhấn Edit:', row);
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getUsers;

        this.routeService.onChange(({ hash }) => {
            this.getUser(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.ACCOUNT.BUYER.MAIN_ACCOUNT.EXPORT;

    ngOnInit() {
        this.getUser();
        this.getUsers();
    }

    getUser = async (hash?: string) => {
        console.log('Lấy dữ liệu người mua với hash (id):', hash); // Kiểm tra id nhận được
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) => this.accountService.getUser({ id }),
        });
        console.log('Dữ liệu người mua nhận được:', this.detail); // Kiểm tra dữ liệu trả về
    };

    getUsers = async (variables?: I_QueryVariables) => {
        const users = await this.accountService.getUsers(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );
        console.log('Buyers data:', users.data);
        const filteredUsers = users.data.filter((user) => user.userType === 2);
        this.table.state.data = filteredUsers.map((user) => ({
            ...user,
            ngaySinh: new Date(user.ngaySinh),
        }));
        this.table.state.pagination = users.pagination;
        this.table.state.selection?.clear();
        this.table.state.expand.clear();
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
            ...(values.changedDate && {
                changedDate: utc(values.changedDate).format(),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        this.modalService.show({
            modal: {
                height: 'auto',
                width: '500px',
                title: 'account.buyer-accounts.buyer-accounts-list.reasonManual',
                content: StatusUpdateComponent,
                footer: {
                    onSubmit: async (values) => {
                        const selectedBuyers = this.table.state.selection.selected;

                        const { buyerStatusUpdate } = await this.accountService.updateBuyerStatus({
                            listStatus: selectedBuyers.map((buyer) => ({
                                buyerId: buyer.id,
                                status,
                            })),
                            reasonManual: values.reasonManual,
                        });

                        if (buyerStatusUpdate.status) {
                            await this.table.refetch();
                            this.notificationService.success('notification.updateSuccessfully');
                        } else {
                            this.notificationService.error(buyerStatusUpdate.error?.message);
                        }

                        this.modalService.hide();
                    },
                },
            },
        });
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE, prefix: TAB_NAME });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
    selectedFile: File | null = null;

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.uploadFile();
        }
    }

    getCsrfToken(): string {
        const match = document.cookie.match(/csrftoken=([\w-]+)/);
        return match ? match[1] : '';
    }
    handleExport = async () => {
        const result = await this.restApiService.get(this.exportUrl, {
            responseType: 'blob',
            observe: 'response',
            headers: {
                Authorization: `Token ${this.localStorageService.get('token')}`,
            },
        });
        if (result.status === 200) {
            FileSaver.saveAs(result.body, 'BuyerExport.csv');
        }
    };

    uploadFile() {
        if (!this.selectedFile) {
            this.notificationService.error('Vui lòng chọn file!');
            return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        const headers = { 'X-CSRFToken': this.getCsrfToken() };

        this.http.post('http://localhost:8000/api/import-students/', formData, { headers }).subscribe(
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

                // Reset the file input after upload
                this.resetFileInput();
            },
            (error) => {
                console.error('Error during file upload:', error); // Log chi tiết lỗi
                this.notificationService.error('Đã xảy ra lỗi khi upload file!');
                // Reset the file input in case of error
                this.resetFileInput();
            },
        );
    }

    resetFileInput() {
        this.selectedFile = null;
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
    }

    // ... existing methods
}
