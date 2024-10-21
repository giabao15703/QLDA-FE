import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router, RouterModule } from '@angular/router';

import { MaterialModules } from '#shared/modules';
import { I_OurPartner } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-user-our-partner',
    templateUrl: './our-partner.component.html',
    styleUrl: './our-partner.component.scss',
    imports: [CommonModule, CarouselModule, MaterialModules, TranslateModule, RouterModule],
})
export class OurPartnerComponent {
    @Input() ourPartners: I_OurPartner[];
    constructor(private router: Router) {}

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
            600: {
                items: 3,
            },
            900: {
                items: 4,
            },
            1200: {
                items: 6,
            },
        },
    };

    goToSupplier(id: string): void {
        this.router.navigateByUrl(`/supplier/${id}`).then(() => {
            window.location.reload();
        });
    }
}
