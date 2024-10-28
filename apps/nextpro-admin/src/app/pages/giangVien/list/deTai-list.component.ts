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
                name: 'tenDeTai', // Sử dụng tenDeTai thay vì name
            },
            {
                label: 'Mô tả', // Thay đổi label cho phù hợp
                name: 'moTa', // Sử dụng moTa thay vì deTai
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
                sort: 'tenDeTai', // Thay đổi key sorting thành tenDeTai
                name: 'tenDeTai', // Đổi name thành tenDeTai
                label: 'Tên đề tài', // Thay đổi label phù hợp
            },
            {
                sort: 'moTa', // Sử dụng moTa để sort
                name: 'moTa', // Đổi name thành moTa
                label: 'Mô tả', // Thay đổi label phù hợp
            },
            {
                sort: 'giangVienFullName', // Sử dụng moTa để sort
                name: 'giangVienFullName', // Đổi name thành moTa
                label: 'Giảng Viên', // Thay đổi label phù hợp
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
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.deTaiService.getDeTai({
                    id,
                }),
        });
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
