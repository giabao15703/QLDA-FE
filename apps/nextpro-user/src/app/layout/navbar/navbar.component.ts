import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ImageComponent, LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AuthService, GroupQLDAService, LocalStorageService, NotificationService } from '#shared/services';
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
    errorMessage: string = '';
    user: I_Profile = {};
    joinRequestId: I_JoinRequest | undefined; // Đảm bảo joinRequestId được định nghĩa chính xác
    notifications: { message: string; id: string }[] = []; // Mảng chứa thông báo với ID
    @ViewChild('notificationTrigger') notificationTrigger: MatMenuTrigger;

    constructor(
        private router: Router,
        public authService: AuthService,
        private localStorageService: LocalStorageService,
        private groupQldaService: GroupQLDAService,
        private notificationService: NotificationService,
    ) {
        this.user = this.localStorageService.get('user');

        this.localStorageService.onChange('user', async (oldValue, newValue) => {
            if (newValue) {
                this.user = newValue;
                this.updateMenuPaths();
            }
        });
    }

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
                console.log('Join Requests:', joinRequests); // Kiểm tra cấu trúc của joinRequests

                this.notifications = joinRequests.map((request: I_JoinRequest) => ({
                    message: `Lời mời tham gia nhóm ${request.group?.id} từ ${request.user?.id}`,
                    id: request.id, // Kiểm tra xem request.id có tồn tại không
                }));
                console.log('Notifications:', this.notifications);
            })
            .catch((error) => console.error('Error loading notifications:', error));
    }
    setJoinRequestId(joinRequestId: string) {
        if (!joinRequestId) {
            console.error('joinRequestId is undefined or invalid.');
            return;
        }
        this.joinRequestId = { id: joinRequestId } as I_JoinRequest;
        console.log('Đã đặt joinRequestId:', this.joinRequestId);
    }

    async acceptJoinRequest(joinRequestId: string) {
        if (!joinRequestId) {
            this.errorMessage = 'Join request ID không tồn tại';
            console.error(this.errorMessage);
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const user_id = user.user?.id;

            if (!user || !user_id) {
                this.errorMessage = 'Thông tin người dùng không tồn tại';
                console.error(this.errorMessage);
                return;
            }

            await this.groupQldaService.getGroupQldaRequest({
                joinRequestId: joinRequestId,
                userId: user_id,
            });
            this.notificationService.success('Đã chấp nhận yêu cầu tham gia');
            console.log('API được gọi thành công');
        } catch (error) {
            console.error('Lỗi khi chấp nhận yêu cầu tham gia:', error);
            this.errorMessage = 'Có lỗi xảy ra khi chấp nhận yêu cầu tham gia.';
        }
        window.location.reload();
    }

    // Cập nhật các đường dẫn menu
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

    openMenu(trigger: MatMenuTrigger) {
        trigger.openMenu();
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
}
