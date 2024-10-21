import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { SaleSchemeSupplierProfileFeatureListPage } from './profile-feature/list/profile-feature-list.component';
import { SaleSchemeSupplierSicpListPage } from './sicp/list/sicp-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sale-scheme-supplier-list',
    templateUrl: './supplier-list.component.html',
    styleUrl: './supplier-list.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        SyncTabsWithAnchorDirective,
        SaleSchemeSupplierProfileFeatureListPage,
        SaleSchemeSupplierSicpListPage,
    ],
})
export class SaleSchemeSupplierListPage {}
