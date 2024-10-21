import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';

@Component({
    standalone: true,
    selector: 'nextpro-user-navigation-supplier',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    imports: [TranslateModule, MaterialModules],
})
export class SupplierNavigationComponent {
    @Output() removeSupplier = new EventEmitter<string>();
    constructor(private translateService: TranslateService) {}

    changeLanguage(language: string) {
        this.translateService.use(language);
    }
}
