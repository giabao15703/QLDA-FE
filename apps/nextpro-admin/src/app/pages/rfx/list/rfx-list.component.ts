import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, RfxService, TableService } from '#shared/services';
import { E_FieldType, E_TableColumnType, I_HistoryPayment, I_QueryVariables } from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-rfx-list',
    templateUrl: './rfx-list.component.html',
    styleUrl: './rfx-list.component.scss',
    providers: [TableService],
    imports: [CommonModule, TranslateModule, MaterialModules, TableComponent, FilterComponent, RouterModule],
})
export class RfxListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_HistoryPayment>,
        private translateService: TranslateService,
        private rfxService: RfxService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'rfx.listing.rfxNo',
                name: 'itemCode_Icontains',
            },
            {
                label: 'rfx.listing.title',
                name: 'title_Icontains',
            },
            {
                label: 'rfx.listing.category',
                name: 'category',
            },
            {
                label: 'rfx.listing.valueFrom',
                name: 'budget_Gte',
            },
            {
                label: 'rfx.listing.valueTo',
                name: 'budget_Lte',
            },
            {
                label: 'rfx.listing.type',
                name: 'rfxType',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'rfx.detail.type.RFI', value: 1 },
                    { label: 'rfx.detail.type.RFP', value: 2 },
                    { label: 'rfx.detail.type.RFQ', value: 3 },
                ],
            },
            {
                label: 'rfx.listing.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'rfx.detail.status.1', value: 1 },
                    { label: 'rfx.detail.status.2', value: 2 },
                    { label: 'rfx.detail.status.3', value: 3 },
                    { label: 'rfx.detail.status.4', value: 4 },
                    { label: 'rfx.detail.status.5', value: 5 },
                    { label: 'rfx.detail.status.6', value: 6 },
                    { label: 'rfx.detail.status.7', value: 7 },
                    { label: 'rfx.detail.status.8', value: 8 },
                ],
            },
            {
                label: 'rfx.listing.fromDate',
                name: 'dueDateFrom',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'rfx.listing.toDate',
                name: 'dueDateTo',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'rfx.listing.quoteAvailability',
                name: 'quoteStatus',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'rfx.detail.quoteAvailability.full', value: 1 },
                    { label: 'rfx.detail.quoteAvailability.notFull', value: 2 },
                ],
            },
            {
                label: 'rfx.listing.awardedSupplier',
                name: 'awardedSupplier',
            },
        ];
        this.table.config.columns = [
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
                name: 'rfx-no',
                sort: 'item_code',
                label: 'rfx.listing.rfxNo',
            },
            {
                name: 'type',
                sort: 'rfx_type',
                label: 'rfx.listing.type',
                render: (cell) => {
                    let methodText;

                    switch (cell) {
                        case 1:
                            methodText = 'rfx.Rfi';
                            break;
                        case 2:
                            methodText = 'rfx.Rfp';
                            break;
                        case 3:
                            methodText = 'rfx.RfQ';
                            break;
                    }

                    return this.translateService.instant(methodText);
                },
            },

            {
                name: 'title',
                sort: 'title',
                label: 'rfx.listing.title',
            },
            {
                name: 'value',
                sort: 'budget',
                label: 'rfx.listing.value',
            },
            {
                sort: 'due_date',
                name: 'duedate',
                label: 'rfx.listing.dueDate',
                render: formatDate,
            },
            {
                name: 'responseBuyer',
                label: 'rfx.listing.responseBuyer',
            },

            {
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'rfx.listing.status',
                render: (cell) => {
                    let status;
                    let statusText;

                    switch (cell) {
                        case 1:
                            status = 'draft';
                            statusText = 'rfx.detail.status.1';
                            break;
                        case 2:
                            status = 'published';
                            statusText = 'rfx.detail.status.2';
                            break;
                        case 3:
                            status = 'duedateexpire';
                            statusText = 'rfx.detail.status.3';
                            break;
                        case 4:
                            status = 'awarded';
                            statusText = 'rfx.detail.status.4';
                            break;
                        case 5:
                            status = 'eAuction';
                            statusText = 'rfx.detail.status.5';
                            break;
                        case 6:
                            status = 'negotiation';
                            statusText = 'rfx.detail.status.6';
                            break;
                        case 7:
                            status = 'complete';
                            statusText = 'rfx.detail.status.7';
                            break;
                        case 8:
                            status = 'cancelled';
                            statusText = 'rfx.detail.status.8';
                            break;
                    }

                    return `<div class="text-${status}">${this.translateService.instant(statusText)}</div>`;
                },
            },
            // {
            //     sort: 'count_supplier',
            //     name: 'icon',
            //     label: 'rfx.icon',
            // },
            {
                sort: 'quotes_compare',
                name: 'quoteCompare',
                label: 'rfx.listing.quoteCompare',
            },
            {
                name: 'awardedSupplier',
                label: 'rfx.listing.awardedSupplier',
            },
        ];
        this.table.config.refetch = this.getRfxes;
    }

    detail = null;

    ngOnInit() {
        this.getRfxes();
    }

    getRfxes = async (variables?: I_QueryVariables) => {
        const rfxes = await this.rfxService.getRfxes(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = rfxes.data;
        this.table.state.pagination = rfxes.pagination;
    };

    handleFilter = (values) => {
        this.table.handleFilter({
            ...values,
            ...(values.dueDateFrom && {
                dueDateFrom: formatDate(values.dueDateFrom, { format: 'YYYY-MM-DD' }),
            }),
            ...(values.dueDateTo && {
                dueDateTo: formatDate(values.dueDateTo, { format: 'YYYY-MM-DD' }),
            }),
        });
    };
}
