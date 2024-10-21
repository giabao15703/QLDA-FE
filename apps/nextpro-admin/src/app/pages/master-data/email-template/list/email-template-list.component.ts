import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmailTemplateDetailComponent } from '../detail/email-template-detail.component';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_EmailTemplate, I_QueryVariables } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-email-list',
    templateUrl: './email-template-list.component.html',
    styleUrl: './email-template-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        EmailTemplateDetailComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
    ],
})
export class EmailTemplateListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_EmailTemplate>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'masterData.itemCode',
                name: 'itemCode_Icontains',
            },
            {
                label: 'masterData.title',
                name: 'title',
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
                sort: 'item_code',
                name: 'itemCode',
                label: 'masterData.itemCode',
            },
            {
                sort: 'title',
                name: 'titleEn',
                label: 'masterData.titleEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'title');
                },
            },
            {
                sort: 'subTitle',
                name: 'titleVi',
                label: 'masterData.titleVi',
                render: (_, __, row) => {
                    return translateData(row, 'vi', 'title');
                },
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
                        onClick: (row: I_EmailTemplate) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getEmailTemplates;

        this.routeService.onChange(({ hash }) => {
            this.getEmailTemplate(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getEmailTemplate();
        this.getEmailTemplates();
    }
    getEmailTemplate = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.masterDataService.getEmailTemplate({
                    id,
                }),
        });
    };

    getEmailTemplates = async (variables?: I_QueryVariables) => {
        const emailTemplates = await this.masterDataService.getEmailTemplates(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = emailTemplates.data;
        this.table.state.pagination = emailTemplates.pagination;
        this.table.state.selection?.clear();
    };

    handleSort = (values) => {
        this.table.handleSort({
            ...values,
            ...(values.orderBy && {
                orderBy: values.orderBy.replace('titleEn', 'title').replace('titleVi', 'title'),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedEmailTemplates = this.table.state.selection.selected;

        const { emailTemplatesUpdateStatus } = await this.masterDataService.updateEmailTemplateStatus({
            listStatus: selectedEmailTemplates.map((EmailTemplate) => ({
                emailTemplatesId: EmailTemplate.id,
                status,
            })),
        });

        if (emailTemplatesUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(emailTemplatesUpdateStatus.error?.message);
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
