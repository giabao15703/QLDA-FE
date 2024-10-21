import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RatingComponent } from '#shared/components';
import { I_SupplierProduct } from '#shared/types';
import { RouterModule } from '@angular/router';

interface I_SupplierProductNormalized extends I_SupplierProduct {
    discountedPricePercent: number;
}

@Component({
    standalone: true,
    selector: 'nextpro-user-supplier-product-list',
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    imports: [CommonModule, FormsModule, RatingComponent, RouterModule],
})
export class ProductListComponent {
    @Input() productList: I_SupplierProduct[] = [];
    productListNormalized: I_SupplierProductNormalized[] = [];

    value = 3;

    ngOnInit(): void {
        this.productListNormalized = this.productList.map((product) => {
            const discountedPricePercent =
                (100 * ((product?.initialPrice ?? 0) - (product?.discountedPrice ?? 0))) / (product?.initialPrice ?? 1);

            return {
                ...product,
                initialPrice: product?.initialPrice ?? 0,
                discountedPrice: product?.discountedPrice ?? 0,
                discountedPricePercent,
            };
        });
    }
}
