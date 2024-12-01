import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
import { DeTaiService, GroupQLDAService } from '#shared/services';
import { I_JoinGroup, I_QueryVariables, I_TableState } from '#shared/types';
import { debug } from 'console';
@Component({
    standalone: true,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'], // Nếu bạn có tệp CSS cho trang này
    imports: [SidebarComponent, NavbarComponent],
})
export class DashboardComponent {
    constructor(
        private deTaiService: DeTaiService,
        private groupService: GroupQLDAService,
    ) {}
    user = JSON.parse(localStorage.getItem('user') || '{}');
    shortName: string = ''; // Biến để lưu shortName
    isLoading: boolean = false;
    isSidebarOpen = true; // Trạng thái mở/đóng Sidebar
    groupData: I_TableState<I_JoinGroup>;
    errorMessage: string = '';

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    async ngOnInit() {
        // Lấy dữ liệu user từ localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);

            // Gắn shortName từ user nếu tồn tại
            this.shortName = user?.shortName ?? 'Không có shortName';
        }
        const group_id = await this.groupService.getJoinGroups({ userId: this.user.id });
        const group = await this.groupService.getJoinGroups({ groupId: parseInt(group_id.data[0].group?.id) });
        console.log(group.data);
    }
    openModal() {}

    getDeTai() {}
}
