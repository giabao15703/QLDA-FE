import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { TableComponent } from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import { LoadingService, LocalStorageService, MasterDataService, RestApiService, TableService } from '#shared/services';
import { E_TableColumnType, I_PromotionHistory, I_QueryVariables } from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-promotion-history-list',
    templateUrl: './promotion-history-list.component.html',
    styleUrl: './promotion-history-list.component.scss',
    providers: [TableService],
    imports: [CommonModule, TranslateModule, MaterialModules, TableComponent, RouterModule],
})
export class PromotionHistoryListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_PromotionHistory>,
        private localStorageService: LocalStorageService,
        private restApiService: RestApiService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [];
        this.table.config.columns = [
            {
                sort: 'title',
                label: 'masterData.title',
                name: 'title',
            },
            {
                sort: 'userName',
                label: 'masterData.promotionHistory.userName',
                name: 'userName',
            },
            {
                sort: 'userUsed',
                label: 'masterData.promotionHistory.userUsed',
                name: 'userUsed',
            },
            {
                label: 'masterData.promotionHistory.userUsedEmail',
                name: 'userUsedEmail',
            },
            {
                cellStyle: { width: '100px' },
                label: 'masterData.promotionHistory.dateUsed',
                name: 'dateUsed',
                render: formatDate,
            },
            {
                label: 'masterData.promotionHistory.realAmount',
                name: 'realAmount',
            },
            {
                label: 'masterData.promotionHistory.amountAfterDiscount',
                name: 'amountAfterDiscount',
            },
            {
                label: 'masterData.promotionHistory.pro_name',
                name: 'promotion.name',
            },
            {
                cellStyle: { width: '100px' },
                label: 'masterData.promotionHistory.pro_from',
                name: 'promotion.validFrom',
                render: formatDate,
            },
            {
                cellStyle: { width: '100px' },
                label: 'masterData.promotionHistory.pro_to',
                name: 'promotion.validTo',
                render: formatDate,
            },
            {
                type: E_TableColumnType.HTML,
                label: 'masterData.visible',
                name: 'visible',
                render: (_, __, row) => {
                    return `<img class="size-8" src="${row.promotion.visible === true ? '/assets/icons/visible-symbol.svg' : '/assets/icons/invisible-symbol.svg'}"  >`;
                },
            },
            {
                label: 'masterData.promotionHistory.pro_userGiven',
                name: 'promotion.userGiven',
            },
            {
                label: 'masterData.promotionHistory.pro_userGivenEmail',
                name: 'promotion.userGivenEmail',
            },
            {
                label: 'masterData.promotionHistory.pro_commission',
                name: 'promotion.commission',
            },
            {
                cellStyle: { width: '100px' },
                type: E_TableColumnType.HTML,
                sort: 'pro_status',
                name: 'status',
                label: 'masterData.status',
                render: (_, __, row) => {
                    return `<div class="text-white text-center p-[10px] bg-${row.promotion?.status ? 'active' : 'inactive'}">
                        ${this.translateService.instant(row.promotion?.status ? 'masterData.active' : 'masterData.inactive')}
                    </div>`;
                },
            },
            {
                sort: 'pro_discount',
                label: 'promotion.discount',
                name: 'promotion.discount',
            },
        ];
        this.table.config.refetch = this.getPromotionHistories;
    }

    exportUrl = REST_API_ADMIN_ENDPOINTS.MASTER_DATA.PROMOTION_HISTORY.EXPORT;

    ngOnInit() {
        this.getPromotionHistories();
    }

    getPromotionHistories = async (variables?: I_QueryVariables) => {
        const promotionHistories = await this.masterDataService.getPromotionHistories(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = promotionHistories.data;
        this.table.state.pagination = promotionHistories.pagination;
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

    handleExport = async () => {
        const result = await this.restApiService.get(this.exportUrl, {
            responseType: 'blob',
            observe: 'response',
            headers: {
                Authorization: `Token ${this.localStorageService.get('token')}`,
            },
        });

        if (result.status === 200) {
            FileSaver.saveAs(result.body, 'PromotionExport.csv');
        }
    };
}
