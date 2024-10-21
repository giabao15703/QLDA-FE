import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RatingComponent } from '#shared/components';
import { I_Product } from '#shared/types';
import { ProductItemComponent } from '#user/pages/product/item/item.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-product-list-component',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    imports: [CommonModule, FormsModule, RatingComponent, RouterModule, ProductItemComponent],
})
export class ProductListComponent {
    @Input() productList: I_Product[];
}
