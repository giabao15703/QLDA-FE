import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { AccountBuyerMainAccountListComponent } from './main-account-list/main-account-list.component';
import { AccountBuyerSubAccountListComponent } from './sub-account-list/sub-account-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-buyer',
    templateUrl: './buyer.component.html',
    styleUrl: './buyer.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        SyncTabsWithAnchorDirective,
        AccountBuyerMainAccountListComponent,
    ],
})
export class AccountBuyerPage {}
