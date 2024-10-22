import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { CouponDetailComponent } from '#admin/pages/coupon/detail/coupon-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    CouponDataService,
    GiangVienService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    RestApiService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Coupon, I_GiangVien, I_QueryVariables } from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';
import { GiangVienDetailComponent } from '../detail/giangVien-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-giangVien-list',
    templateUrl: './giangVien-list.component.html',
    styleUrl: './giangVien-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        GiangVienDetailComponent,
        RouterModule,
    ],
})
export class GiangVienListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_GiangVien>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private giangVienService: GiangVienService,
        private restApiService: RestApiService,
        private localStorageService: LocalStorageService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'Tên',
                name: 'name',
            },
            {
                label: 'Đề tài',
                name: 'deTai',
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
                sort: 'name',
                name: 'name',
                label: 'Tên',
            },
            {
                sort: 'deTai',
                name: 'deTai',
                label: 'Đề tài',
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
                        onClick: (row: I_GiangVien) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getGiangViens;

        this.routeService.onChange(({ hash }) => {
            this.getGiangVien(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.COUPON.EXPORT;

    ngOnInit() {
        this.getGiangVien();
        this.getGiangViens();
    }

    getGiangVien = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.giangVienService.getGiangVien({
                    id,
                }),
        });
    };

    getGiangViens = async (variables?: I_QueryVariables) => {
        const giangViens = await this.giangVienService.getGiangViens(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = giangViens.data;
        this.table.state.pagination = giangViens.pagination;
        this.table.state.selection?.clear();
    };

    /* handleUpdateStatus = async (status) => {
        const selectedCoupons = this.table.state.selection.selected;

        const { couponUpdateStatus } = await this.couponDataService.updateCouponStatus({
            listStatus: selectedCoupons.map((coupon) => ({
                couponId: coupon.id,
                status,
            })),
        });

        if (couponUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(couponUpdateStatus.error?.message);
        }
    }; */

    /* handleExport = async () => {
        const result = await this.restApiService.get(this.exportUrl, {
            responseType: 'blob',
            observe: 'response',
            headers: {
                Authorization: `Token ${this.localStorageService.get('token')}`,
            },
        });

        if (result.status === 200) {
            FileSaver.saveAs(result.body, 'CouponData.xlsx');
        }
    }; */

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
