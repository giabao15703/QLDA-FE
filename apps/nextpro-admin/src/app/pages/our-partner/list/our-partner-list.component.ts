import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { OurPartnerDetailComponent } from '#admin/pages/our-partner/detail/our-partner-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, NotificationService, OurPartnerService, RouteService, TableService } from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    E_TableColumnType,
    I_OurPartner,
    I_QueryVariables,
} from '#shared/types';
import { formatDate, getQueryVariables, makeTableCellClamp } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-our-partner-list',
    templateUrl: './our-partner-list.component.html',
    styleUrl: './our-partner-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        OurPartnerDetailComponent,
        RouterModule,
    ],
})
export class OurPartnerListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_OurPartner>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private ourPartnerService: OurPartnerService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'our-partners.title',
                name: 'title',
            },
            {
                label: 'our-partners.validFrom',
                name: 'validFrom',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'our-partners.validTo',
                name: 'validTo',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },

            {
                label: 'masterData.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'masterData.active',
                        value: true,
                    },
                    {
                        label: 'masterData.inactive',
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
                cellStyle: { width: '200px' },
                sort: 'title',
                name: 'title',
                label: 'our-partners.title',
            },
            {
                cellContentStyle: makeTableCellClamp({ width: '50px' }, 3),
                cellStyle: { width: '200px' },
                type: E_TableColumnType.IMAGE,
                name: 'image',
                label: 'our-partners.image',
            },
            {
                cellStyle: { width: '100px' },
                sort: 'valid_from',
                name: 'validFrom',
                label: 'our-partners.validFrom',
                render: formatDate,
            },
            {
                cellStyle: { width: '100px' },
                sort: 'valid_to',
                name: 'validTo',
                label: 'our-partners.validTo',
                render: formatDate,
            },
            {
                cellStyle: { width: '200px' },
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
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'masterData.actions',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_OurPartner) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getOurPartners;

        this.routeService.onChange(({ hash }) => {
            this.getOurPartner(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getOurPartner();
        this.getOurPartners();
    }

    getOurPartner = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.ourPartnerService.getOurPartner({
                    id,
                }),
        });
    };

    getOurPartners = async (variables?: I_QueryVariables) => {
        const ourPartners = await this.ourPartnerService.getOurPartners(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = ourPartners.data;
        this.table.state.pagination = ourPartners.pagination;
        this.table.state.selection?.clear();
    };

    handleSort = (values) => {
        this.table.handleSort({
            ...values,
            ...(values.orderBy && {
                orderBy: values.orderBy.replace('subName', 'name'),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedCurrencies = this.table.state.selection.selected;

        const { ourPartnerUpdateStatus } = await this.ourPartnerService.updateOurPartnerStatus({
            listStatus: selectedCurrencies.map((ourPartner) => ({
                ourPartnerId: ourPartner.id,
                status,
            })),
        });

        if (ourPartnerUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(ourPartnerUpdateStatus.error?.message);
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
