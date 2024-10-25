import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
import { I_TableState } from '#shared/types';
import { I_GroupQLDA } from 'shared/types/group';
import { FormsModule } from '@angular/forms'; // For ngModel binding
import { GroupQLDAService } from '#shared/services';
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
    ) {}

    ngOnInit() {
        this.getData();
    }

    async onSubmit() {
        try {
            await this.groupQLDAService.createGroupQlda({
                input: {
                    name: this.tenNhom, // Gửi dữ liệu tên nhóm đã được nhập từ form
                },
            });
            this.notificationService.success('Bạn đã tạo nhóm thành công');
        } catch (error) {
            console.error('Lỗi khi tạo nhóm:', error);
            this.errorMessage = 'Có lỗi xảy ra khi tạo nhóm.';
        }
        window.location.reload(); // Reload lại trang sau khi tạo thành công
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

    joinGroup(groupId: string) {
        // Implement your logic to join the group here
        console.log('Joining group with ID:', groupId);
    }
}
