import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

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
import { getQueryVariables } from '#shared/utils';
import { BuyerClubDetailComponent } from '../detail/buyer-club-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-buyer-club-list',
    templateUrl: './buyer-club-list.component.html',
    styleUrl: './buyer-club-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        BuyerClubDetailComponent,
        FilterComponent,
        RouterModule,
    ],
})
export class BuyerClubListPage {
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
                label: 'buyerClub.code',
                name: 'code',
            },
            {
                label: 'buyerClub.name',
                name: 'name',
            },
            {
                label: 'buyerClub.company',
                name: 'company',
            },
            {
                label: 'buyerClub.currentLevel',
                placeholder: 'buyerClub.currentLevel',
                name: 'confirmedStatus',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'buyerClub.standard', value: 'standard' },
                    { label: 'buyerClub.platinum', value: 'platinum' },
                    { label: 'buyerClub.gold', value: 'gold' },
                ],
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
                name: 'code',
                label: 'buyerClub.code',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                sort: 'buyerName',
                name: 'buyerName',
                label: 'buyerClub.buyerName',
            },
            {
                sort: 'buyerCompany',
                name: 'buyerCompany',
                label: 'buyerClub.buyerCompany',
            },
            {
                sort: 'totalRevenueSUS',
                name: 'totalRevenueSUS',
                label: 'buyerClub.totalRevenueSUS',
            },
            {
                sort: 'noFollows',
                name: 'noFollows',
                label: 'buyerClub.noFollows',
            },
            {
                sort: 'currentScore',
                name: 'currentScore',
                label: 'buyerClub.currentScore',
            },
            {
                sort: 'claimCouponGiveaway',
                name: 'claimCouponGiveaway',
                label: 'buyerClub.claimCouponGiveaway',
            },
            {
                sort: 'claimedAccount',
                name: 'claimedAccount',
                label: 'buyerClub.claimedAccount',
            },
            {
                sort: 'claimedDate',
                name: 'claimedDate',
                label: 'buyerClub.claimedDate',
            },
            {
                sort: 'currentLevel',
                name: 'currentLevel',
                label: 'buyerClub.currentLevel',
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
