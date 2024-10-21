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
    LoadingService,
    LocalStorageService,
    NotificationService,
    RestApiService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Coupon, I_QueryVariables } from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-coupon-list',
    templateUrl: './coupon-list.component.html',
    styleUrl: './coupon-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        CouponDetailComponent,
        RouterModule,
    ],
})
export class CouponListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Coupon>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private couponDataService: CouponDataService,
        private restApiService: RestApiService,
        private localStorageService: LocalStorageService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'coupon.couponProgram',
                name: 'couponProgram_Icontains',
            },
            {
                label: 'coupon.description',
                name: 'description_Icontains',
            },
            {
                label: 'coupon.commission',
                name: 'commission',
            },
            {
                label: 'coupon.validFrom',
                name: 'validFrom',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'coupon.validTo',
                name: 'validTo',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'coupon.note',
                name: 'note_Icontains',
            },
            {
                label: 'coupon.fullName',
                name: 'fullName_Icontains',
            },
            {
                label: 'coupon.email',
                name: 'email_Icontains',
            },
            {
                label: 'coupon.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'coupon.active',
                        value: true,
                    },
                    {
                        label: 'coupon.inactive',
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
                sort: 'coupon_program',
                name: 'couponProgram',
                label: 'coupon.couponProgram',
            },
            {
                sort: 'description',
                name: 'description',
                label: 'coupon.description',
            },
            {
                sort: 'commission',
                name: 'commission',
                label: 'coupon.commission',
            },
            {
                sort: 'valid_from',
                name: 'validFrom',
                label: 'coupon.validFrom',
                render: formatDate,
            },
            {
                sort: 'valid_to',
                name: 'validTo',
                label: 'coupon.validTo',
                render: formatDate,
            },
            {
                sort: 'note',
                name: 'note',
                label: 'coupon.note',
            },
            {
                sort: 'full_name',
                name: 'fullName',
                label: 'coupon.fullName',
            },
            {
                sort: 'email',
                name: 'email',
                label: 'coupon.email',
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'coupon.status',
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
                        onClick: (row: I_Coupon) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getCoupons;

        this.routeService.onChange(({ hash }) => {
            this.getCoupon(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.COUPON.EXPORT;

    ngOnInit() {
        this.getCoupon();
        this.getCoupons();
    }

    getCoupon = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.couponDataService.getCoupon({
                    id,
                }),
        });
    };

    getCoupons = async (variables?: I_QueryVariables) => {
        const coupons = await this.couponDataService.getCoupons(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = coupons.data;
        this.table.state.pagination = coupons.pagination;
        this.table.state.selection?.clear();
    };

    handleUpdateStatus = async (status) => {
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
    };

    handleExport = async () => {
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
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
