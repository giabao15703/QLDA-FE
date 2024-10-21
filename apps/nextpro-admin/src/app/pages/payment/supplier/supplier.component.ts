import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { PaymentSupplierDepositListPage } from './deposit/list/deposit-list.component';
import { PaymentSupplierMainListPage } from './main/list/main-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-payment-supplier',
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        PaymentSupplierMainListPage,
        PaymentSupplierDepositListPage,
        SyncTabsWithAnchorDirective,
    ],
})
export class PaymentSupplierListPage {}
