import { MaterialModules } from '#shared/modules';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-related-products',
    imports: [CommonModule, MaterialModules, TranslateModule],
    templateUrl: './related-products.component.html',
    styleUrl: './related-products.component.scss',
})
export class RelatedProductsComponent {
    constructor() {}
}
