import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
import { I_TableState } from '#shared/types';
import { I_GroupQLDA } from 'shared/types/group';
import { FormsModule } from '@angular/forms'; // For ngModel binding
import { GroupQLDAService, NotificationService } from '#shared/services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router để điều hướng
@Component({
    standalone: true,
    selector: 'app-group-registration',
    templateUrl: './group-registration.component.html',
    styleUrls: ['./group-registration.component.scss'],
    imports: [SidebarComponent, NavbarComponent, FormsModule, CommonModule],
})
export class GroupRegistrationComponent implements OnInit {
    tenNhom: string = ''; // Đây là biến chứa giá trị của tên nhóm từ form input
    groupData: I_TableState<I_GroupQLDA>; // Variable to store group data
    isLoading: boolean = false; // For loading indicator
    errorMessage: string = ''; // For error handling
    notificationService: any;

    constructor(
        private groupQLDAService: GroupQLDAService,
        private router: Router, // Sử dụng Router để điều hướng
        private notification: NotificationService,
    ) {}

    ngOnInit() {
        this.getData();
    }

    async onSubmit() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('User từ localStorage:', user); // Thêm dòng này để kiểm tra

            if (!user || !user.id) {
                this.errorMessage = 'Thông tin người dùng không tồn tại';
                return;
            }

            // Gửi yêu cầu tạo nhóm với id người dùng
            await this.groupQLDAService.createGroupQlda({
                input: {
                    name: this.tenNhom,
                },
                userEmail: String(user.email),
            });
            this.notificationService.success('Bạn đã tạo nhóm thành công');
        } catch (error) {
            console.error('Lỗi khi tạo nhóm:', error);
            this.errorMessage = 'Có lỗi xảy ra khi tạo nhóm.';
        }
        window.location.reload();
    }

    getData() {
        this.isLoading = true;
        this.groupQLDAService
            .getGroupQldas()
            .then((data) => {
                this.groupData = data;
                console.log('Group Data:', this.groupData);
            })
            .catch((error) => {
                console.error('Error fetching group data:', error);
                this.errorMessage = 'Không thể tải dữ liệu nhóm.';
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    async onSubmitJoin() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('User từ localStorage:', user);

            if (!user || !user.id) {
                this.errorMessage = 'Thông tin người dùng không tồn tại';
                return;
            }

            await this.groupQLDAService.getGroupQldaJoin({
                groupId: this.groupData.data[0].id,
                userEmail: String(user.email),
            });
            this.notificationService.success('Bạn đã tạo nhóm thành công');
        } catch (error) {
            console.error('Lỗi khi tạo nhóm:', error);
            this.errorMessage = 'Có lỗi xảy ra khi tạo nhóm.';
        }
    }
}
