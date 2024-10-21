import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_BuyerClubVoucher, I_QueryVariables } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';
import { BuyerClubVoucherDetailComponent } from '../detail/buyer-club-voucher-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-buyer-club-voucher-list',
    templateUrl: './buyer-club-voucher-list.component.html',
    styleUrl: './buyer-club-voucher-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        BuyerClubVoucherDetailComponent,
        FilterComponent,
        RouterModule,
    ],
})
export class BuyerClubVoucherListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_BuyerClubVoucher>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'voucher.code',
                name: 'voucherCode',
            },
            {
                label: 'voucher.descriptionEN',
                name: 'descriptionEn',
            },
            {
                label: 'voucher.descriptionVN',
                name: 'descriptionVi',
            },

            {
                label: 'buyerClubVoucher.discountStandard',
                name: 'standard',
            },
            {
                label: 'buyerClubVoucher.discountGold',
                name: 'gold',
            },
            {
                label: 'buyerClubVoucher.discountPlatinum',
                name: 'platinum',
            },
            {
                label: 'buyerClubVoucher.discountDiamond',
                name: 'diamond',
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
                name: 'voucherCode',
                label: 'voucher.code',
            },
            {
                sort: 'descriptionEn',
                name: 'descriptionEn',
                label: 'voucher.descriptionEN',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'description');
                },
            },
            {
                sort: 'descriptionVi',
                name: 'descriptionVi',
                label: 'voucher.descriptionVN',
                render: (_, __, row) => {
                    return translateData(row, 'vi', 'description');
                },
            },
            {
                sort: 'standard',
                name: 'standard',
                label: 'buyerClubVoucher.discountStandard',
            },
            {
                sort: 'gold',
                name: 'gold',
                label: 'buyerClubVoucher.discountGold',
            },
            {
                sort: 'platinum',
                name: 'platinum',
                label: 'buyerClubVoucher.discountPlatinum',
            },
            {
                sort: 'diamond',
                name: 'diamond',
                label: 'buyerClubVoucher.discountDiamond',
            },
            {
                sort: 'label',
                name: 'label',
                label: 'voucher.label',
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
                        onClick: (row: I_BuyerClubVoucher) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getBuyerClubVouchers;
        this.routeService.onChange(({ hash }) => {
            this.getBuyerClubVoucher(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getBuyerClubVoucher();
        this.getBuyerClubVouchers();
    }

    getBuyerClubVoucher = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.masterDataService.getBuyerClubVoucher({
                    id,
                }),
        });
    };

    getBuyerClubVouchers = async (variables?: I_QueryVariables) => {
        const buyerClubVouchers = await this.masterDataService.getBuyerClubVouchers(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = buyerClubVouchers.data;
        this.table.state.pagination = buyerClubVouchers.pagination;
        this.table.state.selection?.clear();
    };

    handleUpdateStatus = async (status) => {
        const selectedBuyerClubVouchers = this.table.state.selection.selected;

        const { buyerClubVoucherUpdateStatus } = await this.masterDataService.updateBuyerClubVoucherStatus({
            listStatus: selectedBuyerClubVouchers.map((buyerClubVoucher) => ({
                voucherId: buyerClubVoucher.id,
                status,
            })),
        });

        if (buyerClubVoucherUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(buyerClubVoucherUpdateStatus.error?.message);
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
