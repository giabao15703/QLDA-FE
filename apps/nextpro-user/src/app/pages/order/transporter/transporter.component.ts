import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { T_Any } from '#shared/types';
import { RecommendationComponent } from '#user/pages/product/recommendation/recommendation.component';
import { NavbarComponent } from 'apps/nextpro-user/src/app/layout';
import { DetailedFooterComponent } from 'apps/nextpro-user/src/app/layout/detailed-footer/detailed-footer.component';
import { OrderDetailTransporterComponent } from '../detail/transporter/detail.component';
import { ListComponent } from '../list/list.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-order-management-transporter',
    templateUrl: './transporter.component.html',
    styleUrl: './transporter.component.scss',
    imports: [
        CommonModule,
        FormsModule,
        NavbarComponent,
        DetailedFooterComponent,
        OrderDetailTransporterComponent,
        ListComponent,
        RecommendationComponent,
        TranslateModule,
    ],
})
export class OrderManagementTransporterPage {
    activeTab = 'detail';

    selectTab(tab: string): void {
        this.activeTab = tab;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDetailClicked(e: T_Any): void {
        this.activeTab = 'detail';
    }
}
