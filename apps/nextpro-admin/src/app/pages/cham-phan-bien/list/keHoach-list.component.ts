import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    KeHoachService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    RestApiService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_KeHoach, I_QueryVariables } from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';
import { KeHoachDetailComponent } from '../detail/keHoach-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-keHoach-list',
    templateUrl: './keHoach-list.component.html',
    styleUrl: './keHoach-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        KeHoachDetailComponent,
        RouterModule,
    ],
})
export class KeHoachListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_KeHoach>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private keHoachService: KeHoachService,
        private restApiService: RestApiService,
        private localStorageService: LocalStorageService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'Mã kế hoạch',
                name: 'maKeHoach',
            },
            {
                label: 'Kỳ mở',
                name: 'kyMo',
            },
            {
                label: 'Số lượng sinh viên',
                name: 'slSinhVien',
            },
            {
                label: 'Số lượng đồ án',
                name: 'slDoAn',
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
                label: 'STT',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            /* {
                sort: 'maKeHoach',
                name: 'maKeHoach',
                label: 'Mã kế hoạch',
            }, */
            {
                sort: 'kyMo',
                name: 'kyMo',
                label: 'Kỳ mở',
                cellStyle: { width: '150px' },
            },
            {
                sort: 'slSinhVien',
                name: 'slSinhVien',
                label: 'Số lượng sinh viên (trong 1 nhóm )',
                cellStyle: { textAlign: 'center', width: '150px' },
            },
            {
                sort: 'slDoAn',
                name: 'slDoAn',
                label: 'Số lượng đồ án (giảng viên có thể đăng kí )',
                cellStyle: { textAlign: 'center', width: '150px' },
            },
            {
                sort: 'tgbdDoAn',
                name: 'tgbdDoAn',
                label: 'Thời gian bắt đầu đồ án',
                cellStyle: { width: '250px' },
                render: formatDate,
            },
            {
                sort: 'tgktDoAn',
                name: 'tgktDoAn',
                label: 'Thời gian kết thúc đồ án',
                cellStyle: { width: '250px' },
                render: formatDate,
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'Hành động',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_KeHoach) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getKeHoachs;

        this.routeService.onChange(({ hash }) => {
            this.getKeHoach(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.COUPON.EXPORT;

    ngOnInit() {
        this.getKeHoach();
        this.getKeHoachs();
    }

    getKeHoach = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.keHoachService.getKeHoach({
                    id,
                }),
        });
    };

    getKeHoachs = async (variables?: I_QueryVariables) => {
        const keHoachs = await this.keHoachService.getKeHoachs(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = keHoachs.data;
        this.table.state.pagination = keHoachs.pagination;
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
