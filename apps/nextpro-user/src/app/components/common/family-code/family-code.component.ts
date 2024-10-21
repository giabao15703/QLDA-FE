import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { I_FamilyCode } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-user-family-code',
    templateUrl: './family-code.component.html',
    styleUrl: './family-code.component.scss',
    imports: [CommonModule, MaterialModules, LoadingComponent, TranslateModule],
})
export class FamilyCodeComponent {
    familyCodesDisplayLimit = 8;
    displayAll = false;
    isMenuOpen = false;

    listIconCategories = {
        '1': 'Appliance.svg',
        '2': 'Fashion.svg',
        '3': 'Gift.svg',
        '4': 'Luggage.svg',
        '5': 'House.svg',
        '6': 'Car.svg',
        '7': 'Makeup.svg',
        '8': 'Computer.svg',
        '9': 'grid.svg',
    };

    getIcon(familyCode: string): string {
        return this.listIconCategories[familyCode];
    }

    @Input() familyCodes: I_FamilyCode[];
    @Input() isLoading?: boolean;
    @ViewChild('childMenu') public childMenu;
    @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

    toggle = () => {
        this.isMenuOpen = !this.isMenuOpen;
    };

    displayAllFamilyCodes(): void {
        this.familyCodesDisplayLimit = this.familyCodes.length;
        this.displayAll = true;
        setTimeout(() => {
            this.menuTrigger.openMenu();
        }, 300);
    }
}
