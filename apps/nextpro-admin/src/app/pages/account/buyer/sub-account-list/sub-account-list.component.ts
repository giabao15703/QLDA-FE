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
    I_BuyerSubAccount,
    I_ProfileFeaturesBuyer,
    I_QueryVariables,
} from '#shared/types';
import { formatDate, getFile, getQueryVariables } from '#shared/utils';
import { AccountBuyerSubAccountDetailComponent } from '../sub-account-detail/sub-account-detail.component';

const TAB_NAME = 'sub';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-buyer-sub-account-list',
    templateUrl: './sub-account-list.component.html',
    styleUrl: './sub-account-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ImportComponent,
        AccountBuyerSubAccountDetailComponent,
    ],
})
export class AccountBuyerSubAccountListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_BuyerSubAccount>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private restApiService: RestApiService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private accountService: AccountService,
        private saleSchemeService: SaleSchemeService,
        private modalService: ModalService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'account.buyer-accounts.buyer-accounts-list.accountID',
                name: 'username',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.accountEmail',
                name: 'email',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.createdDate',
                name: 'created',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.validFrom',
                name: 'validFrom',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.validTo',
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
                label: 'account.buyer-accounts.buyer-accounts-list.profileFeatures',
                name: 'profileFeature',
                loadingName: 'getProfileFeaturesBuyer',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.saleSchemeService.getProfileFeaturesBuyer().then((res) => res.data),
                mapOption: (item: I_ProfileFeaturesBuyer) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.auctionsYear',
                name: 'auctionsYear',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.rfxCancellation',
                name: 'rfxCancel',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'account.buyer-accounts.buyer-accounts-list.active',
                        value: 1,
                    },
                    {
                        label: 'account.buyer-accounts.buyer-accounts-list.inactive',
                        value: 2,
                    },
                    {
                        label: 'account.buyer-accounts.buyer-accounts-list.cancelled',
                        value: 3,
                    },
                    {
                        label: 'account.buyer-accounts.buyer-accounts-list.pending',
                        value: 4,
                    },
                ],
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.changedBy',
                name: 'changedBy',
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.changeDate',
                name: 'changedDate',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'account.buyer-accounts.buyer-accounts-list.reasonInManual',
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
                label: 'account.buyer-accounts.buyer-accounts-list.logID',
            },
            {
                sort: 'username',
                name: 'username',
                label: 'account.buyer-accounts.buyer-accounts-list.accountID',
            },
            {
                sort: 'email',
                name: 'email',
                label: 'account.buyer-accounts.buyer-accounts-list.accountEmail',
            },
            {
                sort: 'created',
                name: 'created',
                label: 'account.buyer-accounts.buyer-accounts-list.createdDate',
                render: formatDate,
            },
            {
                sort: 'valid_from',
                name: 'validFrom',
                label: 'account.buyer-accounts.buyer-accounts-list.validFrom',
                render: (_, __, row) => {
                    return formatDate(row?.buyer?.validFrom);
                },
            },
            {
                sort: 'valid_to',
                name: 'validTo',
                label: 'account.buyer-accounts.buyer-accounts-list.validTo',
                render: (_, __, row) => {
                    return formatDate(row?.buyer?.validTo);
                },
            },
            {
                sort: 'profile_features',
                name: 'profileFeatures',
                label: 'account.buyer-accounts.buyer-accounts-list.profileFeatures',
                render: (_, __, row) => {
                    return row?.buyer?.profileFeatures?.name;
                },
            },
            {
                sort: 'auctions_year',
                name: 'auctionsYear',
                label: 'account.buyer-accounts.buyer-accounts-list.auctionsYear',
                render: (_, __, row) => {
                    return row?.buyer?.profileFeatures?.noEauctionYear;
                },
            },
            {
                sort: 'rfx_cancel',
                name: 'rfxCancellation',
                label: 'account.buyer-accounts.buyer-accounts-list.rfxCancellation',
                render: (_, __, row) => {
                    return row?.buyer?.profileFeatures?.rfxYear;
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
                            statusText = 'account.buyer-accounts.buyer-accounts-list.active';
                            break;
                        case 2:
                            status = 'inactive';
                            statusText = 'account.buyer-accounts.buyer-accounts-list.inactive';
                            break;
                        case 3:
                            status = 'cancelled';
                            statusText = 'account.buyer-accounts.buyer-accounts-list.cancelled';
                            break;
                        case 4:
                            status = 'pending';
                            statusText = 'account.buyer-accounts.buyer-accounts-list.pending';
                            break;
                        default:
                            status = 'undefined';
                            statusText = 'account.buyer-accounts.buyer-accounts-list.undefined';
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
                                statusText = 'account.buyer-accounts.buyer-accounts-list.active';
                                break;
                            case 2:
                                status = 'inactive';
                                statusText = 'account.buyer-accounts.buyer-accounts-list.inactive';
                                break;
                            case 3:
                                status = 'cancelled';
                                statusText = 'account.buyer-accounts.buyer-accounts-list.cancelled';
                                break;
                            case 4:
                                status = 'pending';
                                statusText = 'account.buyer-accounts.buyer-accounts-list.pending';
                                break;
                            default:
                                status = 'undefined';
                                statusText = 'account.buyer-accounts.buyer-accounts-list.undefined';
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
                label: 'account.buyer-accounts.buyer-accounts-list.changedBy',
                render(_, __, row) {
                    return row?.buyerSubAccountsActivity?.edges?.[0]?.node?.changedBy?.username;
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
                label: 'account.buyer-accounts.buyer-accounts-list.changeDate',
                render(_, __, row) {
                    return formatDate(row?.buyerSubAccountsActivity?.edges?.[0]?.node?.changedDate);
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
                label: 'account.buyer-accounts.buyer-accounts-list.reasonInManual',
                render(_, __, row) {
                    return row?.buyerSubAccountsActivity?.edges?.[0]?.node?.reasonManual;
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
                        onClick: (row: I_BuyerSubAccount) => {
                            this.routeService.goTo({ mode: E_Form_Mode.READ, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getBuyerSubAccountsWithBuyer;

        /* this.routeService.onChange(({ hash }) => {
            this.getBuyerSubAccountWithBuyer(hash);
        }); */
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.ACCOUNT.BUYER.MAIN_ACCOUNT.EXPORT;

    ngOnInit() {
        /*  this.getBuyerSubAccountWithBuyer(); */
        this.getBuyerSubAccountsWithBuyer();
    }

    /* getBuyerSubAccountWithBuyer = async (hash?: string) => {
        const response = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.accountService.getBuyerSubAccountWithBuyer({
                    id,
                }),
        });

        if (!response) {
            this.detail = null;
            return;
        }

        const buyerSubAccountWithBuyerDetail = response?.data;

        this.detail = {
            username: buyerSubAccountWithBuyerDetail?.username,
            created: buyerSubAccountWithBuyerDetail?.created,
            gender: buyerSubAccountWithBuyerDetail?.gender,
            phone: buyerSubAccountWithBuyerDetail?.phone,
            position: buyerSubAccountWithBuyerDetail?.position,
            currency: buyerSubAccountWithBuyerDetail?.currency,
            email: buyerSubAccountWithBuyerDetail?.email,
            fullName: buyerSubAccountWithBuyerDetail?.fullName,
            picture: await getFile(buyerSubAccountWithBuyerDetail?.picture),
            profileFeatures: buyerSubAccountWithBuyerDetail?.buyer?.profileFeatures,
            companyFullName: buyerSubAccountWithBuyerDetail?.buyer?.companyFullName,
            companyTax: buyerSubAccountWithBuyerDetail?.buyer?.companyTax,
            companyAddress: buyerSubAccountWithBuyerDetail?.buyer?.companyAddress,
            companyCountry: buyerSubAccountWithBuyerDetail?.buyer?.companyCountry,
            companyCountryState: buyerSubAccountWithBuyerDetail?.buyer?.companyCountryState,
            companyNumberOfEmployee: buyerSubAccountWithBuyerDetail?.buyer?.companyNumberOfEmployee,
            companyWebsite: buyerSubAccountWithBuyerDetail?.buyer?.companyWebsite,
            companyReferralCode: buyerSubAccountWithBuyerDetail?.buyer?.companyReferralCode,
            companyLogo: await getFile(buyerSubAccountWithBuyerDetail?.buyer?.companyLogo),
            buyerIndustry: buyerSubAccountWithBuyerDetail?.buyer?.buyerIndustry,
        };
    }; */

    getBuyerSubAccountsWithBuyer = async (variables?: I_QueryVariables) => {
        const buyerSubAccountsWithBuyer = await this.accountService.getBuyerSubAccountsWithBuyer(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = buyerSubAccountsWithBuyer.data;
        this.table.state.pagination = buyerSubAccountsWithBuyer.pagination;
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
                title: 'account.buyer-accounts.buyer-accounts-list.reasonManual',
                content: StatusUpdateComponent,
                footer: {
                    onSubmit: async (values) => {
                        const selectedBuyerSubAccounts = this.table.state.selection.selected;

                        const { buyerSubAccountsStatusUpdate } = await this.accountService.updateBuyerSubAccountsStatus(
                            {
                                listStatus: selectedBuyerSubAccounts.map((buyerSubAccount) => ({
                                    buyerSubAccountsId: buyerSubAccount.id,
                                    status,
                                })),
                                reasonManual: values.reasonManual,
                            },
                        );

                        if (buyerSubAccountsStatusUpdate.status) {
                            await this.table.refetch();
                            this.notificationService.success('notification.updateSuccessfully');
                        } else {
                            this.notificationService.error(buyerSubAccountsStatusUpdate.error?.message);
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
            FileSaver.saveAs(result.body, 'BuyerSubAccountExport.csv');
        }
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
