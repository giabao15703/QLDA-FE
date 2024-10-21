import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { BannerIndustryFocusDetailComponent } from '../detail/banner-industry-focus-detail.component';
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
import {
    E_FieldAppearance,
    E_FieldType,
    E_Form_Mode,
    E_TableColumnType,
    I_Coupon,
    I_QueryVariables,
} from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-banner-industry-focus-list',
    templateUrl: './banner-industry-focus-list.component.html',
    styleUrl: './banner-industry-focus-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        BannerIndustryFocusDetailComponent,
        FilterComponent,
        RouterModule,
    ],
})
export class BannerIndustryFocusListPage {
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
                label: 'bannerIndustryFocus.selectedCategoryCode',
                name: 'selectedCategoryCode',
            },
            {
                label: 'bannerIndustryFocus.selectedCategoryName',
                name: 'selectedCategoryName',
            },
            {
                label: 'bannerIndustryFocus.effectiveDateFrom',
                name: 'effectiveDateFrom',
                fieldType: E_FieldType.DATEPICKER,
                appearance: E_FieldAppearance.OUTLINE,
                disabled: true,
            },
            {
                label: 'bannerIndustryFocus.effectiveDateTo',
                name: 'effectiveDateTo',
                fieldType: E_FieldType.DATEPICKER,
                appearance: E_FieldAppearance.OUTLINE,
                disabled: true,
            },
            {
                label: 'voucher.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'voucher.active',
                        value: true,
                    },
                    {
                        label: 'voucher.inactive',
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
                name: 'selectedCategoryCode',
                label: 'bannerIndustryFocus.selectedCategoryCode',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                sort: 'selectedCategoryName',
                name: 'selectedCategoryName',
                label: 'bannerIndustryFocus.selectedCategoryName',
            },
            {
                sort: 'effectiveDateFrom',
                name: 'effectiveDateFrom',
                label: 'bannerIndustryFocus.effectiveDateFrom',
                render: formatDate,
            },
            {
                sort: 'effectiveDateTo',
                name: 'effectiveDateTo',
                label: 'bannerIndustryFocus.effectiveDateTo',
                render: formatDate,
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.IMAGE,
                name: 'bannerList[0].file',
                label: 'bannerIndustryFocus.banner',
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
