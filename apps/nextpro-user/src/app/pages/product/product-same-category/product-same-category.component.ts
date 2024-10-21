import { I_Product } from '#shared/types';
import { CommonModule } from '@angular/common';

import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'nextpro-user-product-same-category',
    templateUrl: './product-same-category.component.html',
    styleUrl: './product-same-category.component.scss',
    imports: [CommonModule, FormsModule, RouterModule],
})
export class ProductSameCategoryComponent {
    constructor(private router: Router) {}

    @Input() sameProductsCategory: I_Product[];

    goToSameCategoryProduct(id: string): void {
        //this.router.navigateByUrl(`/product/${id}`);
        this.router.navigateByUrl(`/product/${id}`).then(() => {
            window.location.reload();
        });
    }
}
