import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { ProductService } from '#shared/services';
import { I_Product } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { DiscountedProductsComponent, GlobalSearchComponent } from '#user/components/common';
import { ProductListComponent } from '#user/pages/product/list/list.component';
import { NavbarComponent } from 'apps/nextpro-user/src/app/layout';
import { DetailedFooterComponent } from 'apps/nextpro-user/src/app/layout/detailed-footer/detailed-footer.component';
import { FilterMobileComponent } from './filter-mobile/filter-mobile.component';
import { ProductListFilterComponent } from './filter/filter.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-product-search',
    templateUrl: './product-search.component.html',
    styleUrl: './product-search.component.scss',
    imports: [
        RouterModule,
        CommonModule,
        NavbarComponent,
        DetailedFooterComponent,
        TranslateModule,
        DiscountedProductsComponent,
        ProductListComponent,
        ProductListFilterComponent,
        FilterMobileComponent,
        ReactiveFormsModule,
        MaterialModules,
        GlobalSearchComponent,
    ],
})
export class ProductSearchPage {
    constructor(
        private productService: ProductService,
        private _bottomSheet: MatBottomSheet,
    ) {}

    @Input() pagination;
    @Input() onPageChange;

    showModal = false;
    productFlashSales: I_Product[];
    products: I_Product[];
    productPage = 1;
    productSize = 30;

    async ngOnInit() {
        const productFlashSales = await this.productService.getSupplierProductList({
            type: 'flash_sale',
            ...getQueryVariables({ page: 1, pageSize: 6 }),
        });
        this.productFlashSales = productFlashSales.data;
        const products = await this.productService.getSupplierProductList({
            type: 'product',
            ...getQueryVariables({ page: this.productPage, pageSize: this.productSize }),
        });
        this.products = products.data;
    }

    openBottomSheet(): void {
        this._bottomSheet.open(FilterMobileComponent);
    }

    toggleModal = () => {
        this.showModal = !this.showModal;
    };
}
