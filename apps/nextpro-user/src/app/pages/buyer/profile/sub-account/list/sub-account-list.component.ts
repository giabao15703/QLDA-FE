import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, ImportComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AccountService, LoadingService, LocalStorageService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_Buyer, I_BuyerSubAccount, I_QueryVariables } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';
import { UserBuyerProfileSubAccountFormComponent } from '../form/sub-account-form.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-buyer-profile-sub-account-list',
    templateUrl: './sub-account-list.component.html',
    styleUrl: './sub-account-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        TableComponent,
        FilterComponent,
        ImportComponent,
        UserBuyerProfileSubAccountFormComponent,
    ],
})
export class UserBuyerProfileSubAccountListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_BuyerSubAccount>,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private accountService: AccountService,
    ) {
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                name: 'no',
                label: 'masterData.no',
                render: (_, index) => {
                    return index + 1;
                },
            },
            {
                cellStyle: { width: '60px' },
                type: E_TableColumnType.IMAGE,
                name: 'picture',
                label: 'supplier-profile.tabs.sub-account.picture',
            },
            {
                name: 'fullName',
                label: 'supplier-profile.tabs.sub-account.fullName',
            },
            {
                name: 'phone',
                label: 'supplier-profile.tabs.sub-account.phone',
            },
            {
                name: 'position',
                label: 'supplier-profile.tabs.sub-account.position',
                render: (cell) => translateData(cell, this.localStorageService.get('languageCode'), 'name'),
            },
            {
                name: 'gender',
                label: 'supplier-profile.tabs.sub-account.gender',
                render: (cell) => translateData(cell, this.localStorageService.get('languageCode'), 'name'),
            },
            {
                name: 'email',
                label: 'supplier-profile.tabs.sub-account.email',
            },
            {
                cellStyle: { width: '120px' },
                type: E_TableColumnType.HTML,
                name: 'user',
                label: 'supplier-profile.tabs.sub-account.status.status',
                render: (cell) => {
                    let status;
                    let statusText;

                    switch (cell.status) {
                        case 1:
                            status = 'active';
                            statusText = 'supplier-profile.tabs.sub-account.status.active';
                            break;
                        case 2:
                            status = 'inactive';
                            statusText = 'supplier-profile.tabs.sub-account.status.inactive';
                            break;
                        case 3:
                            status = 'cancelled';
                            statusText = 'supplier-profile.tabs.sub-account.status.cancelled';
                            break;
                        case 4:
                            status = 'pending';
                            statusText = 'supplier-profile.tabs.sub-account.status.pending';
                            break;
                        default:
                            status = 'undefined';
                            statusText = 'supplier-profile.tabs.sub-account.status.undefined';
                            break;
                    }

                    return `<div class="text-white text-center p-[10px] bg-${status}">
                        ${this.translateService.instant(statusText)}
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
                        onClick: (row) => {
                            this.detail = { mode: E_Form_Mode.UPDATE, data: row };
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getBuyerSubAccountsWithBuyer;
    }
    @Input() data: I_Buyer;

    detail = null;

    ngOnInit() {
        this.getBuyerSubAccountsWithBuyer();
    }

    getBuyerSubAccountsWithBuyer = async (variables?: I_QueryVariables) => {
        const buyerSubAccounts = await this.accountService.getBuyerSubAccountsWithBuyer(
            {
                ...getQueryVariables({ variables: { buyerId: this.data.id, ...variables } }),
            },
            { extra: { variables } },
        );

        this.table.state.data = buyerSubAccounts.data;
        this.table.state.pagination = buyerSubAccounts.pagination;
    };

    handleCloseDetailDrawer = () => {
        this.detail = null;
    };

    handleCreate = () => {
        this.detail = { mode: E_Form_Mode.CREATE };
    };
}
