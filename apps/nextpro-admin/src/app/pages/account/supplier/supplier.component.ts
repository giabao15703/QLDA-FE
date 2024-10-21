import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AccountSupplierMainAccountListComponent } from './main-account-list/main-account-list.component';
import { AccountSupplierSubAccountListComponent } from './sub-account-list/sub-account-list.component';
import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-supplier',
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        SyncTabsWithAnchorDirective,
        AccountSupplierMainAccountListComponent,
        AccountSupplierSubAccountListComponent,
    ],
})
export class AccountSupplierPage {}
