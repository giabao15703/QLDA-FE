import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { GroupQLDAService } from '#shared/services';

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

    constructor(private joinGroupsGQL: GroupQLDAService) {}

    ngOnInit() {
        this.checkGroupRegistration();
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
        const currentUserId = parsedUser?.user?.id; // Giữ nguyên userId là chuỗi
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
}
