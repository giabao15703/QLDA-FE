import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { ClusterCodeListComponent } from './cluster-code/list/cluster-code-list.component';
import { CategoryListComponent } from './description-code/list/description-code-list.component';
import { FamilyCodeListComponent } from './family-code/list/family-codes-list.component';
import { SubClusterCodeListComponent } from './sub-cluster-code/list/sub-cluster-code-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-ccc',
    templateUrl: './ccc.component.html',
    styleUrl: './ccc.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        FamilyCodeListComponent,
        ClusterCodeListComponent,
        SubClusterCodeListComponent,
        CategoryListComponent,
        SyncTabsWithAnchorDirective,
    ],
})
export class CCCPage {}
