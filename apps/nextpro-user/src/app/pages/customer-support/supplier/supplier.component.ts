import { ComplainsRefundsSupplierComponent } from '#user/components/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DetailedFooterComponent, NavbarComponent } from 'apps/nextpro-user/src/app/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-customer-support-supplier',
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.scss',
    imports: [
        CommonModule,
        ComplainsRefundsSupplierComponent,
        FormsModule,
        NavbarComponent,
        DetailedFooterComponent,
        TranslateModule,
    ],
})
export class CustomerSupportSupplierPage {}
