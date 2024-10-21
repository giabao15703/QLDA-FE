import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { SicpBankAccountListPage } from './bank-account/list/bank-account-list.component';
import { SicpCertificationManagementListPage } from './certification-management/list/certification-management-list.component';
import { SicpDueDiligenceListPage } from './due-diligence/list/due-diligence-list.component';
import { SicpFinancialRiskManagementListPage } from './financial-risk-management/list/financial-risk-management-list.component';
import { SicpLegalStatusListPage } from './legal-status/list/legal-status-list.component';
import { SicpSanctionCheckListPage } from './sanction-check/list/sanction-check-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sicp',
    templateUrl: './sicp.component.html',
    styleUrl: './sicp.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        SicpBankAccountListPage,
        SicpCertificationManagementListPage,
        SicpDueDiligenceListPage,
        SicpFinancialRiskManagementListPage,
        SicpLegalStatusListPage,
        SicpSanctionCheckListPage,
        SyncTabsWithAnchorDirective,
    ],
})
export class SicpPage {}
