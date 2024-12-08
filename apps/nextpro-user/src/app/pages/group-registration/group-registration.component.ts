import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
import { I_TableState } from '#shared/types';
import { E_RequyestType, I_GroupQLDA } from 'shared/types/group';
import { FormsModule } from '@angular/forms'; // Để binding ngModel
import { GroupQLDAService, NotificationService } from '#shared/services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-group-registration',
    templateUrl: './group-registration.component.html',
    styleUrls: ['./group-registration.component.scss'],
    imports: [SidebarComponent, NavbarComponent, FormsModule, CommonModule],
})
export class GroupRegistrationComponent implements OnInit {
    tenNhom: string = ''; // Tên nhóm từ form input
    groupData: I_TableState<I_GroupQLDA>; // Dữ liệu nhóm
    isLoading: boolean = false; // Hiển thị trạng thái loading
    errorMessage: string = ''; // Thông báo lỗi
    userName: string = ''; // Biến lưu shortName của user

    constructor(
        private groupQLDAService: GroupQLDAService,
        private router: Router, // Router để điều hướng
        private notification: NotificationService,
    ) {}

    ngOnInit() {
        this.getUserData(); // Lấy dữ liệu user từ localStorage
        this.getData(); // Lấy dữ liệu nhóm
    }

    // Lấy thông tin user từ localStorage
    getUserData() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.userName = user.shortName || 'Người dùng không xác định'; // Gán shortName, fallback nếu null
    }

    // Gửi yêu cầu tạo nhóm
    async onSubmit() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('User từ localStorage:', user); // Debugging thông tin user

            if (!user || !user.id) {
                this.errorMessage = 'Thông tin người dùng không tồn tại';
                this.notification.error(this.errorMessage);
                return;
            }

            // Gửi yêu cầu tạo nhóm
            const response = await this.groupQLDAService.createGroupQlda({
                input: {
                    name: this.tenNhom,
                },
            });

            // Kiểm tra phản hồi từ server
            if (response.groupQldaCreate.status) {
                this.notification.success('Bạn đã tạo nhóm thành công');
                window.location.reload();
            } else {
                if (response.groupQldaCreate.error?.code === 'ALREADY_HAS_GROUP') {
                    this.notification.error(`Bạn đã có nhóm`);
                } else if (response.groupQldaCreate.error?.code === 'USER_NOT_FOUND') {
                    this.notification.error('Không tìm thấy thông tin người dùng.');
                } else {
                    this.notification.error(
                        'Có lỗi xảy ra: ' + (response.groupQldaCreate.error?.message || 'Lỗi không xác định.'),
                    );
                }
            }
        } catch (error) {
            console.error('Lỗi khi tạo nhóm:', error);
            this.notification.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.');
        }
    }

    // Lấy danh sách nhóm
    getData() {
        this.isLoading = true;
        this.groupQLDAService
            .getGroupQldas()
            .then((data) => {
                this.groupData = data;
                console.log('Group Data:', this.groupData);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu nhóm:', error);
                this.errorMessage = 'Không thể tải dữ liệu nhóm.';
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    // Tham gia nhóm
    async onSubmitJoin(group_id: string) {
        try {
            console.log('requestType:', E_RequyestType.JOIN_REQUEST);
            console.log('requestType type:', typeof E_RequyestType.JOIN_REQUEST); // Kiểm tra kiểu

            // Truyền giá trị enum vào GraphQL mutation, không cần ép kiểu
            const response = await this.groupQLDAService.getGroupQldaJoin({
                groupId: group_id,
                requestType: E_RequyestType.JOIN_REQUEST, // Truyền trực tiếp kiểu chuỗi
            });

            if (response.groupQldaJoin.status) {
                this.notification.success('Bạn đã xin tham gia nhóm');
                window.location.reload();
            } else {
                this.notification.error(response.groupQldaJoin.error?.message);
            }
        } catch (error) {
            console.error('Lỗi khi tham gia nhóm:', error);
            this.errorMessage = 'Có lỗi xảy ra khi tham gia nhóm.';
        }
    }
}
