import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { AccountService, ProductService } from '#shared/services';
import { I_Product, I_Supplier } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { DiscountedProductsComponent, GlobalSearchComponent } from '#user/components/common';
import { ListSupplierComponent } from '#user/pages/supplier/search/list-supplier/list-supplier.component';
import { NavbarComponent } from 'apps/nextpro-user/src/app/layout';
import { DetailedFooterComponent } from 'apps/nextpro-user/src/app/layout/detailed-footer/detailed-footer.component';
import { FilterMobileComponent } from './filter-mobile/filter-mobile.component';
import { SupplierListingFilterComponent } from './filter/filter.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-supplier-search',
    templateUrl: './supplier-search.component.html',
    styleUrl: './supplier-search.component.scss',
    imports: [
        CommonModule,
        NavbarComponent,
        DetailedFooterComponent,
        TranslateModule,
        DiscountedProductsComponent,
        ListSupplierComponent,
        SupplierListingFilterComponent,
        FilterMobileComponent,
        ReactiveFormsModule,
        MaterialModules,
        GlobalSearchComponent,
    ],
})
export class SupplierSearchPage {
    constructor(
        private productService: ProductService,
        private _bottomSheet: MatBottomSheet,
        private accountService: AccountService,
    ) {}

    @Input() pagination;
    @Input() onPageChange;

    suppliers: I_Supplier[];
    selectedSuppliers: I_Supplier[] = [];
    showModal = false;
    productFlashSales: I_Product[];

    async ngOnInit() {
        const productFlashSales = await this.productService.getSupplierProductList({
            type: 'flash_sale',
            ...getQueryVariables({ page: 1, pageSize: 6 }),
        });
        this.productFlashSales = productFlashSales.data;
        const suppliers = await this.accountService.getSuppliers({
            ...getQueryVariables({ page: 1, pageSize: 6 }),
        });
        this.suppliers = suppliers.data;
    }

    openBottomSheet(): void {
        this._bottomSheet.open(FilterMobileComponent);
    }

    toggleModal = () => {
        this.showModal = !this.showModal;
    };

    onToggleSupplier(supplier: I_Supplier) {
        const supplierIndex = this.selectedSuppliers.findIndex((s) => s.id === supplier.id);
        if (supplierIndex > -1) this.selectedSuppliers.splice(supplierIndex, 1);
        else this.selectedSuppliers.push(supplier);
    }

    onRemoveSupplier(supplierId: string) {
        const supplierIndex = this.selectedSuppliers.findIndex((s) => s.id === supplierId);
        if (supplierIndex > -1) this.selectedSuppliers.splice(supplierIndex, 1);
    }
}
