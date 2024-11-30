import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
import { I_DeTai, I_TableState } from '#shared/types';
import { FormsModule } from '@angular/forms';
import { DeTaiService, NotificationService } from '#shared/services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
    standalone: true,
    selector: 'app-project-registration',
    templateUrl: './project-registration.component.html',
    styleUrls: ['./project-registration.component.scss'], // Nếu bạn có tệp CSS cho trang này
    imports: [SidebarComponent, NavbarComponent, FormsModule, CommonModule],
})
export class ProjectRegistrationComponent {
    tenNhom: string = ''; // Tên nhóm từ form input
    deTaiData: I_TableState<I_DeTai>; // Dữ liệu nhóm
    isLoading: boolean = false; // Hiển thị trạng thái loading
    errorMessage: string = ''; // Thông báo lỗi
    userName: string = ''; // Biến lưu shortName của user

    constructor(
        private deTaiService: DeTaiService,
        private router: Router, // Router để điều hướng
        private notification: NotificationService,
    ) {}

    ngOnInit() {
        // Thực hiện các hành động khi component được khởi
        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.deTaiService
            .getDeTais()
            .then((data) => {
                this.deTaiData = data;
                console.log('DETAI Data:', this.deTaiData);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu đề tài:', error);
                this.errorMessage = 'Không thể tải dữ liệu đề tài.';
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    //Gửi yêu cầu đăng kí đề tài
    async onSubmit() {
        try {
            const response = await this.deTaiService.updateDeTai({
                id: this.deTaiData.data[0].id,
                input: {},
            });
            if (response.deTaiUpdate.status) {
                this.notification.success('Bạn đã xin đăng kí thành công');
                console.log('Đăng kí đề tài thành công:', response);
            } else {
                this.notification.error(response.deTaiUpdate.error.message);
                console.log('Đăng kí đề tài không thành công:', response);
            }

            //window.location.reload();
        } catch (error) {
            console.error('Lỗi khi đăng kí đề tài:', error);
            this.errorMessage = 'Không thể đăng kí đề tài.';
            this.notification.error(this.errorMessage);
        }
    }
}
