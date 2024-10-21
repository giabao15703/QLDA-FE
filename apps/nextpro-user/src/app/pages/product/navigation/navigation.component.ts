import { Component, HostListener, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-navigation-product',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    imports: [TranslateModule],
})
export class UserNavigationComponent {
    constructor(private translateService: TranslateService) {}

    @Input() activeRoute = 'product';

    isScrolled = false;

    @HostListener('window:scroll', [])
    onScroll() {
        this.isScrolled = window.scrollY > 0;
    }

    changeLanguage(language: string) {
        this.translateService.use(language);
    }
}
