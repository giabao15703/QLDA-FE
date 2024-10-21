import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { IndustryClusterListComponent } from './industry-cluster/list/industry-cluster-list.component';
import { IndustrySectorListComponent } from './industry-sector/list/industry-sector-list.component';
import { IndustrySubSectorListComponent } from './industry-sub-sector/list/industry-sub-sector-list.component';
import { IndustryListComponent } from './industry/list/industry-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-industrial-list',
    templateUrl: './industrial-list.component.html',
    styleUrl: './industrial-list.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        IndustryListComponent,
        IndustryClusterListComponent,
        IndustrySectorListComponent,
        IndustrySubSectorListComponent,
        SyncTabsWithAnchorDirective,
    ],
})
export class IndustrialListPage {}
