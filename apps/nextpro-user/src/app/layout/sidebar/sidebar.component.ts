import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { GroupQLDAService, NotificationQLDAService, NotificationService } from '#shared/services';
import { E_RequyestType, I_JoinRequest, I_QueryVariables } from '#shared/types';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    standalone: true,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [MaterialModules, LanguageSwitchComponent, TranslateModule, RouterModule, CommonModule],
})
export class SidebarComponent implements OnInit {
    isSidebarOpen = true; // Sidebar open/close state
    isGroupRegistered = false; // Flag to disable group registration
    unreadCount: number = 0; // Biến để lưu số lượng thông báo chưa đọc
    students: any[] = [];
    notifications: any[] = [];
    hasViewedNotifications: boolean = false;
    joinRequestId: I_JoinRequest;
    router: any;
    authService: any;

    constructor(
        private joinGroupsGQL: GroupQLDAService,
        private notificationQLDAService: NotificationQLDAService,
        private notificationService: NotificationService,
        private groupQldaService: GroupQLDAService,
    ) {}

    ngOnInit() {
        this.checkGroupRegistration();
        this.getNotifications();
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
    private async checkGroupRegistration() {
        const user = localStorage.getItem('user');

        if (!user) {
            console.error('Không tìm thấy user trong localStorage');
            return;
        }

        const parsedUser = JSON.parse(user);
        const currentUserId = parsedUser?.id; // Giữ nguyên userId là chuỗi
        console.log('UserId từ localStorage:', currentUserId); // Kiểm tra userId lấy từ localStorage

        try {
            const joinGroups = await this.joinGroupsGQL.getJoinGroups({
                userId: currentUserId, // Truyền userId dưới dạng chuỗi
            });

            console.log('Fetched join groups:', joinGroups); // Debugging: kiểm tra dữ liệu trả về từ GraphQL

            // Kiểm tra xem người dùng đã tham gia nhóm chưa
            this.isGroupRegistered = joinGroups.data.some(
                (joinGroup) => String(joinGroup.user?.id) === currentUserId, // Chuyển joinGroup.user?.id thành chuỗi
            );

            console.log('isGroupRegistered:', this.isGroupRegistered); // Debugging: kiểm tra giá trị isGroupRegistered
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhóm:', error);
        }
    }

    getNotifications = async (variables?: I_QueryVariables) => {
        const notifications = await this.notificationQLDAService.getNotifications({}, { extra: { variables } });
        console.log('Danh sách thông báo:', notifications);

        // Lọc các thông báo có status = true
        this.notifications = (notifications.data || []).filter((notification: any) => notification.status === true);

        // Cập nhật số lượng thông báo chưa đọc (status = true)
        this.unreadCount = this.notifications.length;
    };

    onNotificationClick() {
        this.hasViewedNotifications = true; // Đánh dấu đã xem thông báo
        this.unreadCount = 0; // Đặt số lượng thông báo là 0
    }

    // Hàm tải lại số lượng thông báo mới khi có dữ liệu mới
    reloadNotifications() {
        this.hasViewedNotifications = false; // Đánh dấu lại chưa xem thông báo
        this.getNotifications(); // Tải lại thông báo mới
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

    @ViewChild('notificationTrigger') notificationTrigger: MatMenuTrigger;

    openMenu(trigger: MatMenuTrigger) {
        trigger.openMenu();
    }
}
