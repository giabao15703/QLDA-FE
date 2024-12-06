import { Component, OnInit } from '@angular/core';
import { GroupQLDAService } from '#shared/services';
import { I_GroupQLDA } from '#shared/types';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';

@Component({
    standalone: true,
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss'],
    imports: [SidebarComponent, NavbarComponent],
})
export class GroupComponent implements OnInit {
    groups: I_GroupQLDA[];
    joinGroups: any[]; // Declare joinGroups property

    constructor(private groupService: GroupQLDAService) {}

    ngOnInit() {
        const userId = localStorage.getItem('user');
        console.log('User ID from localStorage:', userId);

        if (userId) {
            // Gửi yêu cầu API để lấy danh sách nhóm mà người dùng tham gia
            this.groupService.getGroupsByUser(userId).subscribe((groups) => {
                console.log('Groups fetched from API:', groups); // Log groups fetched from the API

                // Lọc nhóm mà người dùng tham gia
                this.groups = this.filterGroupsByUser(groups, userId);
                console.log('Filtered Groups for user:', this.groups); // Log nhóm đã lọc
            });

            // Giả sử bạn cũng có thông tin `joinGroups` từ API hoặc từ một dịch vụ khác
            this.groupService.getJoinGroups({ userId: Number(userId) }).then((response) => {
                console.log('Join groups for user:', response.data); // Log joinGroups
                this.joinGroups = response.data;
            });
        } else {
            console.log('No user ID found in localStorage.');
        }
    }

    // Hàm lọc nhóm dựa trên user_id trong join_groups
    filterGroupsByUser(groups: I_GroupQLDA[], userId: string): I_GroupQLDA[] {
        return groups.filter((group) => {
            // Kiểm tra nếu user_id có trong join_groups của nhóm
            return this.joinGroups.some((join) => join.user?.id === userId && join.group?.id === group.id);
        });
    }
}
