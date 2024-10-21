import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_Promotion, I_QueryVariables } from '#shared/types';
import { formatDate, getQueryVariables, translateData } from '#shared/utils';
import { PromotionDetailComponent } from '../detail/promotion-detail.component';

const TAB_NAME = 'main';

@Component({
    standalone: true,
    selector: 'nextpro-admin-promotion-list',
    templateUrl: './promotion-list.component.html',
    styleUrl: './promotion-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        PromotionDetailComponent,
        RouterModule,
    ],
})
export class PromotionListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Promotion>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                type: E_TableColumnType.SELECTION,
                name: 'selection',
            },
            {
                sort: 'name',
                name: 'name',
                label: 'masterData.promotionProgram',
            },
            {
                sort: 'descriptionEn',
                name: 'descriptionEn',
                label: 'masterData.descriptionEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'description');
                },
            },
            {
                sort: 'descriptionVi',
                name: 'descriptionVi',
                label: 'masterData.descriptionVi',
                render: (_, __, row) => {
                    return translateData(row, 'vi', 'description');
                },
            },
            {
                name: 'userGiven',
                label: 'masterData.userGiven',
            },
            {
                name: 'userGivenEmail',
                label: 'masterData.email',
            },
            {
                name: 'commission',
                label: 'masterData.commission',
            },
            {
                sort: 'discount',
                name: 'discount',
                label: 'masterData.discount',
            },
            {
                cellStyle: { width: '100px' },
                name: 'validFrom',
                label: 'masterData.validFrom',
                render: formatDate,
            },
            {
                cellStyle: { width: '100px' },
                name: 'validTo',
                label: 'masterData.validTo',
                render: formatDate,
            },
            {
                type: E_TableColumnType.HTML,
                name: 'buyer',
                label: 'masterData.buyer',
                render: (_, __, row) => {
                    return `<img class="size-8 " src="${row.applyForBuyer === true ? '/assets/icons/check-symbol.svg' : '/assets/icons/no-symbol.svg'}"  >`;
                },
            },
            {
                type: E_TableColumnType.HTML,
                name: 'supplier',
                label: 'masterData.supplier',
                render: (cell, index, row) => {
                    return `<img class="size-8" src="${row.applyForSupplier === true ? '/assets/icons/check-symbol.svg' : '/assets/icons/no-symbol.svg'}"  >`;
                },
            },
            {
                type: E_TableColumnType.HTML,
                name: 'Scope',
                label: 'masterData.scope',
                render: (_, __, row) => {
                    let content = '';

                    if (row.applyScope.includes('ALL_SCOPE')) {
                        content = 'Profile Features SICP ';
                    } else if (row.applyScope.includes('PROFILE_FEATURES')) {
                        content = 'Profile Features ';
                    } else if (row.applyScope.includes('SICP')) {
                        content = 'SICP ';
                    } else {
                        content = '_';
                    }

                    return `<p class='text-center'> ${content} </p>`;
                },
            },
            {
                cellStyle: { width: '100px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'masterData.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                        ${this.translateService.instant(cell ? 'masterData.active' : 'masterData.inactive')}
                    </div>`;
                },
            },
            {
                type: E_TableColumnType.HTML,
                name: 'visible',
                label: 'masterData.visible',
                render: (_, __, row) => {
                    return `<img class="size-8" src="${row.visible === true ? '/assets/icons/visible-symbol.svg' : '/assets/icons/invisible-symbol.svg'}"  >`;
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
                        onClick: (row: I_Promotion) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getPromotions;

        this.routeService.onChange(({ hash }) => {
            this.getPromotion(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getPromotion();
        this.getPromotions();
    }

    getPromotion = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.masterDataService.getPromotion({
                    id,
                }),
        });
    };

    getPromotions = async (variables?: I_QueryVariables) => {
        const promotions = await this.masterDataService.getPromotions(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = promotions.data;
        this.table.state.pagination = promotions.pagination;
        this.table.state.selection?.clear();
    };

    handleSort = (values) => {
        this.table.handleSort({
            ...values,
            ...(values.orderBy && {
                orderBy: values.orderBy.replace('descriptionEn', 'description').replace('descriptionVi', 'description'),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedPromotions = this.table.state.selection.selected;

        const { promotionUpdateStatus } = await this.masterDataService.updatePromotionStatus({
            listStatus: selectedPromotions.map((promotion) => ({
                promotionId: promotion.id,
                status,
            })),
        });

        if (promotionUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(promotionUpdateStatus.error?.message);
        }
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE, prefix: TAB_NAME });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
