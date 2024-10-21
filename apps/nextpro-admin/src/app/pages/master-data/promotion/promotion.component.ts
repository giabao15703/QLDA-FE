import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { PromotionListComponent } from './main/list/promotion-list.component';
import { PromotionHistoryListComponent } from './history/list/promotion-history-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-promotion',
    templateUrl: './promotion.component.html',
    styleUrl: './promotion.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        PromotionListComponent,
        PromotionHistoryListComponent,
        SyncTabsWithAnchorDirective,
    ],
})
export class PromotionPage {}
