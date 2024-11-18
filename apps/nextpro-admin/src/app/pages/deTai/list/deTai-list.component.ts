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
    NotificationService,
    RestApiService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_DeTai, I_QueryVariables } from '#shared/types'; // Sử dụng I_DeTai thay vì I_GiangVien
import { formatDate, getQueryVariables } from '#shared/utils';
import { DeTaiDetailComponent } from '../detail/deTai-detail.component';
@Component({
    standalone: true,
    selector: 'nextpro-admin-deTai-list', // Thay đổi tên selector
    templateUrl: './deTai-list.component.html', // Thay đổi đường dẫn file HTML
    styleUrl: './deTai-list.component.scss', // Thay đổi đường dẫn file SCSS
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        DeTaiDetailComponent, // Thay đổi sang DeTaiDetailComponent
        RouterModule,
    ],
})
export class DeTaiListPage {
    // Đổi tên class từ GiangVienListPage sang DeTaiListPage
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_DeTai>, // Thay đổi từ I_GiangVien sang I_DeTai
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private deTaiService: DeTaiService, // Thay đổi sang DeTaiService
        private restApiService: RestApiService,
        private localStorageService: LocalStorageService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'Tên đề tài', // Thay đổi label cho phù hợp
                name: 'tendoan', // Sử dụng tenDeTai thay vì name
            },
            {
                label: 'Mô tả', // Thay đổi label cho phù hợp
                name: 'mota', // Sử dụng moTa thay vì deTai
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
                sort: 'tendoan', // Thay đổi key sorting thành tenDeTai
                name: 'tendoan', // Đổi name thành tenDeTai
                label: 'Tên đề tài', // Thay đổi label phù hợp
            },
            {
                sort: 'giangVienLongName',
                name: 'giangVienLongName',
                label: 'Giảng viên phụ trách',
            },
            {
                sort: 'mota', // Sử dụng moTa để sort
                name: 'mota', // Đổi name thành moTa
                label: 'Mô tả', // Thay đổi label phù hợp
            },
            {
                sort: 'yeucau', // Sử dụng moTa để sort
                name: 'yeucau', // Đổi name thành moTa
                label: 'Yêu Cầu', // Thay đổi label phù hợp
            },
            {
                sort: 'trangthai', // Sử dụng trangThai để sort
                name: 'trangthai', // Đổi name thành trangThai
                label: 'Trạng thái', // Thay đổi label phù hợp
                render: (value) => {
                    switch (value) {
                        case '0':
                            return 'Đang chờ duyệt';
                        case '1':
                            return 'Đã duyệt';
                        case '2':
                            return 'Đã huỷ';
                        case '3':
                            return 'Yêu cầu chỉnh sửa';
                        default:
                            return 'Không xác định';
                    }
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
                        onClick: (row: I_DeTai) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getDeTais; // Thay đổi hàm refetch

        this.routeService.onChange(({ hash }) => {
            this.getDeTai(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.COUPON.EXPORT;

    ngOnInit() {
        this.getDeTai();
        this.getDeTais();
    }

    getDeTai = async (hash?: string) => {
        try {
            this.detail = await this.routeService.getDetail({
                hash,
                detail: async ({ id }) => {
                    const deTai = await this.deTaiService.getDeTai({ id });
                    return deTai;
                },
            });
        } catch (error) {
            console.error('Error fetching deTai:', error);
        }
    };

    getDeTais = async (variables?: I_QueryVariables) => {
        const deTais = await this.deTaiService.getDeTais(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = deTais.data;
        this.table.state.pagination = deTais.pagination;
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
