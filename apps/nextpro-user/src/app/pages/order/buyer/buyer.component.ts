import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { I_Order } from '#shared/types';
import { RecommendationComponent } from '#user/pages/product/recommendation/recommendation.component';
import { NavbarComponent } from 'apps/nextpro-user/src/app/layout';
import { DetailedFooterComponent } from 'apps/nextpro-user/src/app/layout/detailed-footer/detailed-footer.component';
import { OrderDetailBuyerComponent } from '../detail/buyer/detail.component';
import { ListComponent } from '../list/list.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-order-management-buyer',
    templateUrl: './buyer.component.html',
    styleUrl: './buyer.component.scss',
    imports: [
        CommonModule,
        FormsModule,
        NavbarComponent,
        DetailedFooterComponent,
        ListComponent,
        OrderDetailBuyerComponent,
        RecommendationComponent,
        TranslateModule,
    ],
})
export class OrderManagementBuyerPage {
    activeTab = 'list';
    selectedOrder: I_Order;

    selectTab(tab: string): void {
        this.activeTab = tab;
    }

    onDetailClicked(order: I_Order): void {
        this.selectedOrder = order;
        this.activeTab = 'detail';
    }
}
