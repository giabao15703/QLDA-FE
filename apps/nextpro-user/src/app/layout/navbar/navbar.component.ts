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
    menus: any;

    constructor(
        private router: Router,
        public authService: AuthService,
        private localStorageService: LocalStorageService,
        private groupQldaService: GroupQLDAService,
        private notificationService: NotificationService,
    ) {
        this.user = this.localStorageService.get('user');

        /* this.localStorageService.onChange('user', async (oldValue, newValue) => {
            if (newValue) {
                this.user = newValue;
                this.updateMenuPaths();
            }
        }); */
    }

    ngOnInit() {
        this.user = this.localStorageService.get('user');
        this.LoadNotifications();
    }

    LoadNotifications() {
        console.log('LoadNotifications() được gọi');

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Dữ liệu user từ localStorage:', user);

        if (!user || !user.shortName) {
            console.error('Người dùng không có shortName.');
            return;
        }

        this.groupQldaService
            .getGroupQldaRequests()
            .then((joinRequests: I_JoinRequest[]) => {
                console.log('Dữ liệu trả về từ API:', joinRequests);

                if (!joinRequests || joinRequests.length === 0) {
                    console.log('Không có yêu cầu tham gia nhóm.');
                    this.notifications = [];
                    return;
                }

                this.notifications = joinRequests
                    .filter((request: I_JoinRequest) => {
                        console.log(`So sánh leader: ${request.group?.creatorShortName} === ${user.shortName}`);
                        return request.group?.creatorShortName === user.shortName;
                    })
                    .map((request: I_JoinRequest) => ({
                        message: `Lời mời tham gia nhóm ${request.group?.id} từ người dùng ${request.user?.id}`,
                        id: request.id,
                    }));

                console.log('Notifications sau khi xử lý:', this.notifications);
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API:', error);
            });
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
            this.notificationService.error('Join request ID không tồn tại');
            console.error('Join request ID không tồn tại');
            return;
        }

        try {
            const response = await this.groupQldaService.acceptJoinRequest({
                joinRequestId: joinRequestId,
            });
            this.notificationService.success('Đã chấp nhận yêu cầu tham gia');
            window.location.reload();
        } catch (error) {
            this.notificationService.error('Lỗi khi chấp nhận yêu cầu tham gia');
            console.error('Lỗi khi chấp nhận yêu cầu tham gia:', error);
        }
    }

    // Cập nhật các đường dẫn menu
    /* updateMenuPaths() {
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
    } */

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
        /* 'Thông báo 1: Lời mời gia nhập nhóm abcxyz',
        'Thông báo 2',
        'Thông báo 3',
        'Thông báo 4',
        'Thông báo 5',
        'Thông báo 6',
        'Thông báo 7', */
    ];

    @ViewChild('notificationTrigger') notificationTrigger: MatMenuTrigger;

    openMenu(trigger: MatMenuTrigger) {
        trigger.openMenu();
    }
}
