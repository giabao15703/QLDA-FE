import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MaterialModules } from '#shared/modules';
import { I_Product } from '#shared/types';
import { MatDialog } from '@angular/material/dialog';
import { BuyNowComponent } from '../buy-now/buy-now.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-discounted-products',
    imports: [CommonModule, MaterialModules, TranslateModule, CarouselModule],
    templateUrl: './discounted-products.component.html',
    styleUrl: './discounted-products.component.scss',
})
export class DiscountedProductsComponent {
    @Input() productsList: I_Product[];

    constructor(public dialog: MatDialog) {}

    customOptions: OwlOptions = {
        loop: true,
        autoplay: true,
        navSpeed: 800,
        dots: false,
        touchDrag: false,
        mouseDrag: false,
        responsive: {
            0: {
                items: 2,
            },
            1000: {
                items: 5,
            },
        },
    };

    openBuyNowDialog(): void {
        const dialogRef = this.dialog.open(BuyNowComponent, {
            width: '900px',
            panelClass: 'custom-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Dialog was closed. Result:', result);
        });
    }
}
