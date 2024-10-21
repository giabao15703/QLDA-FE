import { CartComponent } from '#user/pages/product/cart/cart.component';
import { RecommendationComponent } from '#user/pages/product/recommendation/recommendation.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from 'apps/nextpro-user/src/app/layout';
import { DetailedFooterComponent } from 'apps/nextpro-user/src/app/layout/detailed-footer/detailed-footer.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-cart',
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
    imports: [
        CommonModule,
        CartComponent,
        FormsModule,
        NavbarComponent,
        DetailedFooterComponent,
        RecommendationComponent,
    ],
})
export class CartPage {}
