import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, FormComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    NotificationService,
    RouteService,
    TableService,
    UserSupplierSicpService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_QueryVariables, I_Sicp } from '#shared/types';
import { formatDate, getFile, getQueryVariables } from '#shared/utils';

const TAB_NAME = 'sanctioncheck';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sicp-sanction-check-list',
    templateUrl: './sanction-check-list.component.html',
    styleUrl: './sanction-check-list.component.scss',
    providers: [FormService, TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        FormComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
    ],
})
export class SicpSanctionCheckListPage {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        public table: TableService<I_Sicp>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private sicpService: UserSupplierSicpService,
    ) {
        this.form.config = [
            {
                name: 'textEditerEn',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
            {
                name: 'fileNameEn',
                label: 'sicp.legalStatus.dropFileEN',
                fieldType: E_FieldType.UPLOAD,
                showPreview: true,
            },
            {
                name: 'textEditerVi',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
            {
                name: 'fileNameVi',
                label: 'sicp.legalStatus.dropFileVI',
                fieldType: E_FieldType.UPLOAD,
                showPreview: true,
            },
        ];
        this.table.config.filterForm = [
            {
                label: 'sicp.legalStatus.accountId',
                name: 'accountID',
            },
            {
                label: 'sicp.legalStatus.companyName',
                name: 'companyName',
            },
            {
                label: 'sicp.legalStatus.companyEmail',
                name: 'companyEmail',
            },
            {
                label: 'sicp.legalStatus.sicpRegis',
                name: 'type',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'sicp.legalStatus.unsecured', value: 1 },
                    { label: 'sicp.legalStatus.bronze', value: 2 },
                    { label: 'sicp.legalStatus.silver', value: 3 },
                    { label: 'sicp.legalStatus.gold', value: 4 },
                ],
            },
            {
                label: 'sicp.legalStatus.statusSup',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'sicp.legalStatus.approve', value: 1 },
                    { label: 'sicp.legalStatus.pending', value: 2 },
                    { label: 'sicp.legalStatus.reject', value: 3 },
                ],
            },
            {
                label: 'sicp.legalStatus.dateFrom',
                name: 'dateFrom',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'sicp.legalStatus.dateTo',
                name: 'dateTo',
                fieldType: E_FieldType.DATEPICKER,
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
                name: 'accountID',
                sort: 'accountID',
                label: 'sicp.legalStatus.accountId',
            },
            {
                name: 'companyName',
                sort: 'companyName',
                label: 'sicp.legalStatus.companyName',
            },
            {
                name: 'companyEmail',
                sort: 'companyEmail',
                label: 'sicp.legalStatus.companyEmail',
            },
            {
                name: 'SicpRegistration',
                sort: 'SicpRegistration',
                label: 'sicp.legalStatus.sicpRegis',
                render: (cell) => {
                    let methodText;

                    switch (cell) {
                        case 1:
                            methodText = 'rfx.legalStatus.unsecured';
                            break;
                        case 2:
                            methodText = 'rfx.legalStatus.bronze';
                            break;
                        case 3:
                            methodText = 'rfx.legalStatus.silver';
                            break;
                        case 4:
                            methodText = 'rfx.legalStatus.gold';
                            break;
                    }

                    return this.translateService.instant(methodText);
                },
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'sicp.legalStatus.statusSup',
                render: (cell) => {
                    let status;
                    let statusText;

                    switch (cell) {
                        case 1:
                            status = 'draft';
                            statusText = 'sicp.approve';
                            break;
                        case 2:
                            status = 'published';
                            statusText = 'sicp.pending';
                            break;
                        case 3:
                            status = 'duedateexpire';
                            statusText = 'sicp.reject';
                            break;
                    }

                    return `<div class="text-${status}">${this.translateService.instant(statusText)}</div>`;
                },
            },

            {
                name: 'document',
                sort: 'document',
                label: 'sicp.legalStatus.doc',
            },
            {
                sort: 'duedate',
                name: 'duedate',
                label: 'sicp.legalStatus.date',
                render: formatDate,
            },
            {
                sort: 'statusSystem',
                name: 'statusSystem',
                label: 'sicp.legalStatus.statusSystem',
            },
            {
                name: 'docAfterUpdateInternal',
                label: 'sicp.legalStatus.docAfterUpdateInternal',
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'our-partners.action',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_Sicp) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
    }

    detail = null;

    ngOnInit() {
        this.getUserSupplierSicpTextEditor();
        this.getUserSupplierSicps();
    }

    getUserSupplierSicps = async (variables?: I_QueryVariables) => {
        const userSupplierSicps = await this.sicpService.getUserSupplierSicps(
            {
                ...getQueryVariables({ variables: { ...variables, fileFilter: 8 } }),
            },
            { extra: { variables } },
        );

        this.table.state.data = userSupplierSicps.data;
        this.table.state.pagination = userSupplierSicps.pagination;
    };

    getUserSupplierSicpTextEditor = async (variables?: I_QueryVariables) => {
        const userSupplierSicpTextEditor = await this.sicpService.getUserSupplierSicpTextEditor(
            {
                ...getQueryVariables({ variables: { ...variables, sicpTypeFilter: '8' } }),
            },
            { extra: { variables } },
        );

        const userSupplierSicpTextEditorData = userSupplierSicpTextEditor?.data?.[0];

        this.form.patchValue({
            textEditerEn: userSupplierSicpTextEditorData?.textEditerEn,
            fileNameEn: await getFile(userSupplierSicpTextEditorData?.sicpTextEditorFiles?.edges?.[0]?.node?.fileName),
            textEditerVi: userSupplierSicpTextEditorData?.textEditerVi,
            fileNameVi: await getFile(userSupplierSicpTextEditorData?.sicpTextEditorFiles?.edges?.[1]?.node?.fileName),
        });
    };

    handleSaveTextEditor = async () => {
        this.form.submit(async (values) => {
            const { userSupplierSicpTextEditorCreate } = await this.sicpService.createUserSupplierSicpTextEditor({
                input: {
                    sicpType: 5,
                    textEditerEn: values.textEditerEn,
                    fileNameEn: [values.fileNameEn],
                    isFileEnDeleted: false,
                    textEditerVi: values.textEditerVi,
                    fileNameVi: [values.fileNameVi],
                    isFileViDeleted: false,
                },
            });

            if (userSupplierSicpTextEditorCreate.status) {
                await this.table.refetch();
                this.notificationService.success('notification.updateSuccessfully');
            } else {
                this.notificationService.error(userSupplierSicpTextEditorCreate.error?.message);
            }
        });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
