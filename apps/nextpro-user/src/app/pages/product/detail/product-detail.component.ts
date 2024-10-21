import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { GlobalSearchComponent } from '#user/components/common';
import { ProductDetailComponent } from '#user/pages/product/detail/detail.component';
import { FilterMobileComponent } from '#user/pages/product/search/filter-mobile/filter-mobile.component';
import { ProductListFilterComponent } from '#user/pages/product/search/filter/filter.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NavbarComponent } from 'apps/nextpro-user/src/app/layout';
import { DetailedFooterComponent } from 'apps/nextpro-user/src/app/layout/detailed-footer/detailed-footer.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-product-detail-page',
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss',
    imports: [
        CommonModule,
        NavbarComponent,
        DetailedFooterComponent,
        TranslateModule,
        ProductDetailComponent,
        GlobalSearchComponent,
        ProductListFilterComponent,
        FilterMobileComponent,
    ],
})
export class ProductDetailsPage {
    constructor(private _bottomSheet: MatBottomSheet) {}

    showModal = false;

    openBottomSheet(): void {
        this._bottomSheet.open(FilterMobileComponent);
    }

    toggleModal = () => {
        this.showModal = !this.showModal;
    };
}
