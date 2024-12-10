import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { GroupQLDAService, NotificationQLDAService } from '#shared/services';
import { I_QueryVariables } from '#shared/types';

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
    constructor(
        private joinGroupsGQL: GroupQLDAService,
        private notificationQLDAService: NotificationQLDAService,
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
}
