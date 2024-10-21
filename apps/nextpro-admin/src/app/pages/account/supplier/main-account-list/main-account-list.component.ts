import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { utc } from 'moment';

import {
    FilterComponent,
    ImportComponent,
    LoadingComponent,
    StatusUpdateComponent,
    TableComponent,
} from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    LoadingService,
    LocalStorageService,
    ModalService,
    NotificationService,
    RestApiService,
    RouteService,
    SaleSchemeService,
    TableService,
} from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    E_TableColumnType,
    I_ProfileFeaturesSupplier,
    I_QueryVariables,
    I_Supplier,
} from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';
import { AccountSupplierMainAccountDetailComponent } from '../main-account-detail/main-account-detail.component';

const TAB_NAME = 'main';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-supplier-main-account-list',
    templateUrl: './main-account-list.component.html',
    styleUrl: './main-account-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        AccountSupplierMainAccountDetailComponent,
    ],
})
export class AccountSupplierMainAccountListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Supplier>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private accountService: AccountService,
        private saleSchemeService: SaleSchemeService,
        private localStorageService: LocalStorageService,
        private restApiService: RestApiService,
        private modalService: ModalService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'account.supplier-accounts.supplier-accounts-list.accountID',
                name: 'username',
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.accountEmail',
                name: 'email',
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.createdDate',
                name: 'created',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.validFrom',
                name: 'validFrom',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.validTo',
                name: 'validTo',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
                min: (formGroup) => {
                    return formGroup.get('validFrom').value
                        ? utc(formGroup.get('validFrom').value).add(1, 'd').format()
                        : '';
                },
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.profileFeatures',
                name: 'profileFeature',
                loadingName: 'getProfileFeaturesSupplier',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.saleSchemeService.getProfileFeaturesSupplier().then((res) => res.data),
                mapOption: (item: I_ProfileFeaturesSupplier) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.flashSale',
                name: 'flashSale',
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.reportYear',
                name: 'reportYear',
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'account.supplier-accounts.supplier-accounts-list.active',
                        value: 1,
                    },
                    {
                        label: 'account.supplier-accounts.supplier-accounts-list.inactive',
                        value: 2,
                    },
                    {
                        label: 'account.supplier-accounts.supplier-accounts-list.cancelled',
                        value: 3,
                    },
                    {
                        label: 'account.supplier-accounts.supplier-accounts-list.pending',
                        value: 4,
                    },
                ],
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.changedBy',
                name: 'changedBy',
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.changeDate',
                name: 'changedDate',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.supplier-accounts.supplier-accounts-list.reasonInManual',
                name: 'reasonManual',
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
                sort: 'id',
                name: 'id',
                label: 'account.supplier-accounts.supplier-accounts-list.logID',
            },
            {
                sort: 'username',
                name: 'username',
                label: 'account.supplier-accounts.supplier-accounts-list.accountID',
            },
            {
                sort: 'email',
                name: 'email',
                label: 'account.supplier-accounts.supplier-accounts-list.accountEmail',
            },
            {
                sort: 'created',
                name: 'created',
                label: 'account.supplier-accounts.supplier-accounts-list.createdDate',
                render: formatDate,
            },
            {
                sort: 'valid_from',
                name: 'validFrom',
                label: 'account.supplier-accounts.supplier-accounts-list.validFrom',
                render: formatDate,
            },
            {
                sort: 'valid_to',
                name: 'validTo',
                label: 'account.supplier-accounts.supplier-accounts-list.validTo',
                render: formatDate,
            },
            {
                sort: 'profile_features',
                name: 'profileFeatures',
                label: 'account.supplier-accounts.supplier-accounts-list.profileFeatures',
                render: (_, __, row) => {
                    return row.profileFeatures.name;
                },
            },
            {
                sort: 'flash_sale',
                name: 'flashSale',
                label: 'account.supplier-accounts.supplier-accounts-list.flashSale',
                render: (_, __, row) => {
                    return row.profileFeatures.flashSale;
                },
            },
            {
                sort: 'report_year',
                name: 'reportYear',
                label: 'account.supplier-accounts.supplier-accounts-list.reportYear',
                render: (_, __, row) => {
                    return row.profileFeatures.reportYear;
                },
            },
            {
                cellStyle: { width: '80px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'user',
                label: 'masterData.status',
                render: (cell) => {
                    let status;
                    let statusText;

                    switch (cell.status) {
                        case 1:
                            status = 'active';
                            statusText = 'account.supplier-accounts.supplier-accounts-list.active';
                            break;
                        case 2:
                            status = 'inactive';
                            statusText = 'account.supplier-accounts.supplier-accounts-list.inactive';
                            break;
                        case 3:
                            status = 'cancelled';
                            statusText = 'account.supplier-accounts.supplier-accounts-list.cancelled';
                            break;
                        case 4:
                            status = 'pending';
                            statusText = 'account.supplier-accounts.supplier-accounts-list.pending';
                            break;
                        default:
                            status = 'undefined';
                            statusText = 'account.supplier-accounts.supplier-accounts-list.undefined';
                            break;
                    }

                    return `<div class="text-white text-center p-[10px] bg-${status}">
                        ${this.translateService.instant(statusText)}
                    </div>`;
                },
                expand: {
                    type: E_TableColumnType.HTML,
                    render: (row) => {
                        let status;
                        let statusText;

                        switch (row.node.changedState) {
                            case 1:
                                status = 'active';
                                statusText = 'account.supplier-accounts.supplier-accounts-list.active';
                                break;
                            case 2:
                                status = 'inactive';
                                statusText = 'account.supplier-accounts.supplier-accounts-list.inactive';
                                break;
                            case 3:
                                status = 'cancelled';
                                statusText = 'account.supplier-accounts.supplier-accounts-list.cancelled';
                                break;
                            case 4:
                                status = 'pending';
                                statusText = 'account.supplier-accounts.supplier-accounts-list.pending';
                                break;
                            default:
                                status = 'undefined';
                                statusText = 'account.supplier-accounts.supplier-accounts-list.undefined';
                                break;
                        }

                        return `<div class="text-white text-center p-[10px] bg-${status}">
                            ${this.translateService.instant(statusText)}
                        </div>`;
                    },
                },
            },
            {
                cellStyle: { width: '90px' },
                name: 'changedBy',
                label: 'account.supplier-accounts.supplier-accounts-list.changedBy',
                render(_, __, row) {
                    return row?.supplierActivity?.edges?.[0]?.node?.changedBy?.username;
                },
                expand: {
                    render: (row) => {
                        return row.node.changedBy.username;
                    },
                },
            },
            {
                cellStyle: { width: '80px' },
                name: 'changeDate',
                label: 'account.supplier-accounts.supplier-accounts-list.changeDate',
                render(_, __, row) {
                    return formatDate(row?.supplierActivity?.edges?.[0]?.node?.changedDate);
                },
                expand: {
                    render: (row) => {
                        return formatDate(row.node.changedDate);
                    },
                },
            },
            {
                cellStyle: { width: '100px' },
                name: 'reasonInManual',
                label: 'account.supplier-accounts.supplier-accounts-list.reasonInManual',
                render(_, __, row) {
                    return row?.supplierActivity?.edges?.[0]?.node?.reasonManual;
                },
                expand: {
                    render: (row) => {
                        return row.node.reasonManual;
                    },
                },
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.EXPAND,
                name: 'expand',
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
                        onClick: (row: I_Supplier) => {
                            this.routeService.goTo({ mode: E_Form_Mode.READ, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getSuppliers;

        this.routeService.onChange(({ hash }) => {
            this.getSupplier(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.ACCOUNT.SUPPLIER.MAIN_ACCOUNT.EXPORT;

    ngOnInit() {
        this.getSupplier();
        this.getSuppliers();
    }

    getSupplier = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.accountService.getSupplier({
                    id,
                }),
        });
    };

    getSuppliers = async (variables?: I_QueryVariables) => {
        const suppliers = await this.accountService.getSuppliers(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = suppliers.data;
        this.table.state.pagination = suppliers.pagination;
        this.table.state.selection?.clear();
        this.table.state.expand.clear();
    };

    handleFilter = (values) => {
        this.table.handleFilter({
            ...values,
            ...(values.created && {
                created: utc(values.created).format(),
            }),
            ...(values.validFrom && {
                validFrom: utc(values.validFrom).format(),
            }),
            ...(values.validTo && {
                validTo: utc(values.validTo).add(86399, 's').format(),
            }),
            ...(values.changedDate && {
                changedDate: utc(values.changedDate).format(),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        this.modalService.show({
            modal: {
                height: 'auto',
                width: '500px',
                title: 'account.supplier-accounts.supplier-accounts-list.reasonManual',
                content: StatusUpdateComponent,
                footer: {
                    onSubmit: async (values) => {
                        const selectedSuppliers = this.table.state.selection.selected;

                        const { supplierStatusUpdate } = await this.accountService.updateSupplierStatus({
                            listStatus: selectedSuppliers.map((supplier) => ({
                                supplierId: supplier.id,
                                status,
                            })),
                            reasonManual: values.reasonManual,
                        });

                        if (supplierStatusUpdate.status) {
                            await this.table.refetch();
                            this.notificationService.success('notification.updateSuccessfully');
                        } else {
                            this.notificationService.error(supplierStatusUpdate.error?.message);
                        }

                        this.modalService.hide();
                    },
                },
            },
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
            FileSaver.saveAs(result.body, 'SupplierExport.csv');
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
