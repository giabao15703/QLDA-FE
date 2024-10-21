import { CommonModule } from '@angular/common';
import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { I_Supplier } from '#shared/types';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-list-supplier',
    templateUrl: './list-supplier.component.html',
    styleUrl: './list-supplier.component.scss',
    imports: [CommonModule, MaterialModules, FormsModule, ProductListComponent, TranslateModule, RouterModule],
})
export class ListSupplierComponent implements DoCheck {
    isSelected = false;
    productList = [];
    @Input() supplier: I_Supplier;
    @Input() selectedSuppliers: I_Supplier[] = [];
    @Output() toggleSupplier = new EventEmitter<I_Supplier>();

    onSelectSupplier() {
        this.toggleSupplier.emit(this.supplier);
    }

    ngDoCheck() {
        this.isSelected = this.selectedSuppliers.some((sup) => sup.id === this.supplier.id);
    }

    ngOnInit() {
        this.productList = this?.supplier?.supplierProducts?.edges.map((edge) => edge.node) ?? [];
    }

    handleImageError(event: Event) {
        (event.target as HTMLImageElement).src = '/assets/icons/avatar-supplier.svg';
    }
}
