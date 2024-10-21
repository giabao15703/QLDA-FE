import { MaterialModules } from '#shared/modules';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DetailedFooterComponent, NavbarComponent } from '../../../layout';
import { CartComponent } from '../cart/cart.component';
import { RecommendationComponent } from '../recommendation/recommendation.component';

@Component({
    selector: 'nextpro-user-product-set-advertising',
    standalone: true,
    imports: [
        CommonModule,
        CartComponent,
        FormsModule,
        NavbarComponent,
        DetailedFooterComponent,
        RecommendationComponent,
        TranslateModule,
        RouterModule,
        MaterialModules,
    ],
    templateUrl: './product-set.component.html',
    styleUrl: './product-set.component.scss',
})
export class ProductSetAdvertisingPage {
    productSet = [
        {
            id: '0',
            name: 'Advertising',
            banner: '/assets/images/banner1.png',
            backgroundColor: '#3d1401',
            products: [
                {
                    id: '0',
                    image: '/assets/images/Image289.png',
                    name: 'Product 1',
                    price: 100,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '1',
                    image: '/assets/images/Image289.png',
                    name: 'Product 2',
                    price: 200,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '2',
                    image: '/assets/images/Image289.png',
                    name: 'Product 3',
                    price: 300,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '3',
                    image: '/assets/images/Image289.png',
                    name: 'Product 4',
                    price: 400,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
            ],
        },
        {
            id: '1',
            name: 'Advertising',
            banner: '/assets/images/banner2.png',
            backgroundColor: '#EB7629',
            products: [
                {
                    id: '0',
                    image: '/assets/images/Image289.png',
                    name: 'Product 1',
                    price: 100,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '1',
                    image: '/assets/images/Image289.png',
                    name: 'Product 2',
                    price: 200,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '2',
                    image: '/assets/images/Image289.png',
                    name: 'Product 3',
                    price: 300,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '3',
                    image: '/assets/images/Image289.png',
                    name: 'Product 4',
                    price: 400,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
            ],
        },
        {
            id: '2',
            name: 'Advertising',
            banner: '/assets/images/banner3.jpeg',
            backgroundColor: '#e0f7fa',
            products: [
                {
                    id: '0',
                    image: '/assets/images/Image289.png',
                    name: 'Product 1',
                    price: 100,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '1',
                    image: '/assets/images/Image289.png',
                    name: 'Product 2',
                    price: 200,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '2',
                    image: '/assets/images/Image289.png',
                    name: 'Product 3',
                    price: 300,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
                {
                    id: '3',
                    image: '/assets/images/Image289.png',
                    name: 'Product 4',
                    price: 400,
                    minimum: 30,
                    origin: 'Việt Nam',
                },
            ],
        },
    ];

    backgroundColor: string = '#3d1401';

    handleImageError(event: Event) {
        (event.target as HTMLImageElement).src = '/assets/icons/avatar-supplier.svg';
    }

    setBackgroundColor(color: string) {
        this.backgroundColor = color;
    }
}
