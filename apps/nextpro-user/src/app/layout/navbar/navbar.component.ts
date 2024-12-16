import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ImageComponent, LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    AuthService,
    GroupQLDAService,
    LocalStorageService,
    NotificationService,
} from '#shared/services';
import { E_RequyestType, E_UserType, I_JoinGroup, I_JoinRequest, I_Profile, I_TableState } from '#shared/types';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'nextpro-user-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    imports: [
        CommonModule,
        MaterialModules,
        TranslateModule,
        LanguageSwitchComponent,
        RouterModule,
        ImageComponent,
        FormsModule,
    ],
})
export class NavbarComponent {
    errorMessage: string = '';
    user: I_Profile = {};
    joinRequestId: I_JoinRequest | undefined; // Đảm bảo joinRequestId được định nghĩa chính xác
    menus: any;
    passwords = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    @ViewChild('changePasswordDialog') changePasswordDialog: any;
    constructor(
        private router: Router,
        public authService: AuthService,
        private localStorageService: LocalStorageService,
        private groupQldaService: GroupQLDAService,
        private notificationService: NotificationService,
        private accountService: AccountService,
        private dialog: MatDialog,
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
    openChangePasswordDialog(): void {
        const dialogRef = this.dialog.open(this.changePasswordDialog, {
            width: '400px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Gọi hàm cập nhật mật khẩu sau khi dialog đóng
                this.onSubmit();
            }
        });
    }

    // Khi submit form, kiểm tra mật khẩu mới và xác nhận mật khẩu
    onSubmit() {
        if (this.passwords.newPassword !== this.passwords.confirmPassword) {
            this.notificationService.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Thực hiện mutation để thay đổi mật khẩu
        this.updatePassword();
    }

    // Gọi service để thay đổi mật khẩu
    updatePassword() {
        const variables = {
            currentPassword: this.passwords.currentPassword,
            newPassword: this.passwords.newPassword,
        };

        // Gọi phương thức getUpdatePassword từ AuthService
        this.accountService.getUpdatePassword(variables).then(
            (response) => {
                if (response.updatePassword.status) {
                    this.notificationService.success('Mật khẩu đã được thay đổi thành công!');
                } else {
                    this.notificationService.error(
                        response.updatePassword.error?.message || 'Lỗi khi thay đổi mật khẩu.',
                    );
                }
            },
            (error) => {
                this.notificationService.error('Có lỗi xảy ra khi thay đổi mật khẩu.');
            },
        );
    }
    LoadNotifications() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Dữ liệu user từ localStorage:', user);

        if (!user || !user.shortName) {
            console.error('Người dùng không có shortName.');
            return;
        }
        const variable = [];
        const check_leader = this.groupQldaService.getGroupQldaRequests({ leaderUserId: user.id });

        this.groupQldaService
            .getGroupQldaRequests() // Lấy tất cả yêu cầu tham gia nhóm
            .then((joinRequests: I_JoinRequest[]) => {
                console.log('Dữ liệu trả về từ API:', joinRequests);

                if (!joinRequests || joinRequests.length === 0) {
                    console.log('Không có yêu cầu tham gia nhóm.');
                    this.notifications = [];
                    return;
                }

                const check_leader = joinRequests.some((request: I_JoinRequest) => request.leaderUserId == user.id);
                const userId = parseFloat(user.id);

                if (check_leader) {
                    this.notifications = joinRequests
                        .filter(
                            (request: I_JoinRequest) =>
                                request.leaderUserId == userId && request.requestType == E_RequyestType.JOIN_REQUEST,
                        )
                        .map((request: I_JoinRequest) => ({
                            message: `Người dùng ${request.user?.shortName} muốn xin vào nhóm của ${request.group?.name}`,
                            id: request.id,
                        }));
                } else {
                    this.notifications = joinRequests
                        .filter(
                            (request: I_JoinRequest) =>
                                request.user.id == user.id && request.requestType == E_RequyestType.INVITE,
                        )
                        .map((request: I_JoinRequest) => ({
                            message: `Bạn đã được mời tham gia nhóm ${request.group?.name}`,
                            id: request.id,
                        }));
                }
            })
            .catch((error) => {
                console.error('Lỗi khi lấy yêu cầu tham gia nhóm:', error);
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
            if (response.acceptJoinRequest.status) {
                this.notificationService.success('Đã chấp nhận yêu cầu tham gia');
                window.location.reload(); // Cập nhật lại trang sau khi chấp nhận
            } else {
                this.notificationService.error(response.acceptJoinRequest.error?.message);
            }
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
