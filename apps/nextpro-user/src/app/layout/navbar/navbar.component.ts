import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ImageComponent, LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AuthService, GroupQLDAService, LocalStorageService } from '#shared/services';
import { E_UserType, I_JoinRequest, I_Profile } from '#shared/types';
import { MatMenuTrigger } from '@angular/material/menu';

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
        private groupQldaService: GroupQLDAService,
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
        this.user = this.localStorageService.get('user');
        this.LoadNotifications();
    }
    LoadNotifications() {
        const currentUserId = localStorage.getItem('user');

        if (!currentUserId) {
            console.error('Không xác định được userId từ localStorage.');
            return;
        }

        this.groupQldaService
            .getGroupQldaRequests()
            .then((joinRequests: I_JoinRequest[]) => {
                this.notifications = joinRequests.map(
                    (request: I_JoinRequest) => `Lời mời tham gia nhóm ${request.group?.id} từ ${request.user?.id}`,
                );
            })
            .catch((error) => console.error('Error loading notifications:', error));
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

    notifications = [
        'Thông báo 1: Lời mời gia nhập nhóm abcxyz',
        'Thông báo 2',
        'Thông báo 3',
        'Thông báo 4',
        'Thông báo 5',
        'Thông báo 6',
        'Thông báo 7',
    ];

    @ViewChild('notificationTrigger') notificationTrigger: MatMenuTrigger;

    openMenu(trigger: MatMenuTrigger) {
        trigger.openMenu();
    }
}
