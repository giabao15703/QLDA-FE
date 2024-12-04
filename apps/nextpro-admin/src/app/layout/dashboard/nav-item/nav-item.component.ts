import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MaterialModules } from '#shared/modules';
import { LocalStorageService, RouteService } from '#shared/services';
import { I_NavItem, I_Profile } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-admin-layout-dashboard-nav-item',
    templateUrl: './nav-item.component.html',
    styleUrl: './nav-item.component.scss',
    imports: [CommonModule, MaterialModules],
})
export class NavItemComponent {
    constructor(
        private localStorageService: LocalStorageService,
        private routeService: RouteService,
    ) {
        this.routeService.onChange(({ route }) => {
            this.isActive = this.navItem.href === route;
        });
    }
    user: I_Profile = {};
    @Input() navParent: I_NavItem;
    @Input() navItem: I_NavItem;
    @Input() isExpanded = false;

    isActive: boolean = false;

    ngOnInit() {
        this.user = this.localStorageService.get('user');
        const activeMenu = this.localStorageService.get('activeMenu') ?? '';
        const activeSubMenu = this.localStorageService.get('activeSubMenu') ?? '';

        if (this.navItem.name === activeMenu) {
            this.isExpanded = true;
        }

        if (this.navItem.href === activeSubMenu) {
            this.isActive = true;
        }
    }

    toggleSubMenu = () => {
        this.isExpanded = !this.isExpanded;
    };

    activeSubMenu = (navItem) => {
        const activeSubMenu = navItem.href;

        if (this.navParent) {
            const activeMenu = this.navParent.name;
            this.localStorageService.set('activeMenu', activeMenu);
        } else {
            this.localStorageService.remove('activeMenu');
        }

        this.localStorageService.set('activeSubMenu', activeSubMenu);
    };

    handleItemClick = (navItem) => {
        if (navItem.href) {
            this.activeSubMenu(navItem);
            this.routeService.navigate([navItem.href]);
        }

        this.toggleSubMenu();
    };
}
