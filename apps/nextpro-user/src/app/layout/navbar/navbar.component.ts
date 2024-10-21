import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ImageComponent, LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AuthService, LocalStorageService } from '#shared/services';
import { E_UserType, I_Profile } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-user-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    imports: [CommonModule, MaterialModules, TranslateModule, LanguageSwitchComponent, RouterModule, ImageComponent],
})
export class NavbarComponent {
    constructor(
        private router: Router,
        public authService: AuthService,
        private localStorageService: LocalStorageService,
    ) {
        this.user = this.localStorageService.get('user');

        this.localStorageService.onChange('user', async (oldValue, newValue) => {
            if (newValue) {
                this.user = newValue;
                this.updateMenuPaths();
            }
        });
    }

    menus = [
        { label: 'navbar.search', path: '/product', activePaths: ['/product', '/supplier'] },
        { label: 'navbar.rfx', path: '/rfx', activePaths: ['/rfx'] },
        { label: 'navbar.e-auction', path: '/e-auction', activePaths: ['/e-auction'] },
        {
            label: 'navbar.order',
            path: '',
            activePaths: [],
        },
    ];
    user: I_Profile = {};

    ngOnInit() {
        this.updateMenuPaths();
    }

    updateMenuPaths() {
        const isBuyer = this.user.userType === E_UserType.BUYER;

        const pathsConfig = {
            buyer: {
                path: '/purchase-order/buyer',
                activePaths: ['/purchase-order/buyer'],
            },
            supplier: {
                path: '/purchase-order/supplier',
                activePaths: ['/purchase-order/supplier'],
            },
        };

        const selectedPaths = isBuyer ? pathsConfig.buyer : pathsConfig.supplier;

        this.menus = this.menus.map((menu) =>
            menu.label === 'navbar.order'
                ? { ...menu, path: selectedPaths.path, activePaths: selectedPaths.activePaths }
                : menu,
        );
    }

    isActive(paths: string[]): boolean {
        return paths.includes(this.router.url);
    }

    redirectTo(path: string) {
        this.router.navigate([path]);
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    onLogout() {
        this.authService.logout();
    }
}
