import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    DeTaiService, // Thay đổi từ GiangVienService sang DeTaiService
    LoadingService,
    LocalStorageService,
    NotificationQLDAService,
    NotificationService,
    RestApiService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_DeTai, I_Notification, I_QueryVariables } from '#shared/types'; // Sử dụng I_DeTai thay vì I_GiangVien
import { formatDate, getQueryVariables } from '#shared/utils';
import { NotificationDetailComponent } from '../detail/notification-detail.component';
@Component({
    standalone: true,
    selector: 'nextpro-admin-notification-list', // Thay đổi tên selector
    templateUrl: './notification-list.component.html', // Thay đổi đường dẫn file HTML
    styleUrl: './notification-list.component.scss', // Thay đổi đường dẫn file SCSS
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
        NotificationDetailComponent,
    ],
})
export class NotificationListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Notification>, // Thay đổi từ I_GiangVien sang I_DeTai
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private restApiService: RestApiService,
        private localStorageService: LocalStorageService,
        private notificationQLDAService: NotificationQLDAService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'Tiêu đề',
                name: 'title',
                value: '',
            },
            {
                label: 'Nội dung', // Thay đổi label cho phù hợp
                name: 'content',
                value: '', // Sử dụng moTa thay vì deTai
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
                sort: 'title', // Thay đổi key sorting thành tenDeTai
                name: 'title', // Đổi name thành tenDeTai
                label: 'Tiêu đề', // Thay đổi label phù hợp
            },
            {
                sort: 'content',
                name: 'content',
                label: 'Nội dung',
            },
            {
                sort: 'createdDate',
                name: 'createdDate',
                label: 'Ngày tạo',
                cellContentStyle: { 'white-space': 'pre-wrap' },
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'Trạng thái',
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
                        onClick: (row: I_Notification) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getNotifications; // Thay đổi hàm refetc

        this.routeService.onChange(({ hash }) => {
            this.getNotification(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.COUPON.EXPORT;
    count_Total: number = 0;
    count_Approved: number = 0;
    count_Not_Approved: number = 0;

    ngOnInit() {
        this.getNotification();
        this.getNotifications();
    }

    getNotification = async (hash?: string) => {
        try {
            this.detail = await this.routeService.getDetail({
                hash,
                detail: async ({ id }) => {
                    const notification = await this.notificationQLDAService.getNotification({ id });
                    return notification;
                },
            });
        } catch (error) {
            console.error('Error fetching deTai:', error);
        }
    };

    getNotifications = async (variables?: I_QueryVariables) => {
        const variables_input = {
            title: this.table.config.filterForm.find((filter) => filter.name === 'title')?.value || '',
            content: this.table.config.filterForm.find((filter) => filter.name === 'content')?.value || '',
        };

        const notifications = await this.notificationQLDAService.getNotifications(
            {
                ...getQueryVariables({
                    variables: {
                        ...variables_input, // Truyền giá trị vào query API
                    },
                }),
            },
            { extra: { variables } },
        );

        this.count_Total = notifications.data.length;
        this.table.state.data = notifications.data;
        this.table.state.pagination = notifications.pagination;
        this.table.state.selection?.clear();
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
