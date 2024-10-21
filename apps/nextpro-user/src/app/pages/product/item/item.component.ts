import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RatingComponent } from '#shared/components';
import { I_Product } from '#shared/types';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-product-item',
    templateUrl: './item.component.html',
    styleUrl: './item.component.scss',
    imports: [CommonModule, FormsModule, RatingComponent, RouterModule, TranslateModule],
})
export class ProductItemComponent {
    constructor(private router: Router) {}
    showDescription = false;
    @Input() product: I_Product;

    goToProductDetail(id: string): void {
        this.router.navigateByUrl(`/product/${id}`).then(() => {
            window.location.reload();
        });
    }

    toggleDescription(): void {
        this.showDescription = !this.showDescription;
    }

    getTranslationIndex(): number {
        const currentLang = JSON.parse(localStorage.getItem('languageCode') || '"en"');
        return currentLang === 'vi' ? 1 : 0;
    }
}
