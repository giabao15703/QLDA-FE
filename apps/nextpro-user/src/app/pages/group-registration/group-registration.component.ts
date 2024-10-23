import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';

@Component({
    standalone: true,
    selector: 'app-group-registration',
    templateUrl: './group-registration.component.html',
    styleUrls: ['./group-registration.component.scss'],
    imports: [SidebarComponent, NavbarComponent],
})
export class GroupRegistrationComponent {
    tenNhom: string = '';

    constructor() {
        // Khởi tạo các biến hoặc dịch vụ cần thiết
    }

    ngOnInit() {
        // Thực hiện các hành động khi component được khởi tạo
    }

    onSubmit() {
        // Xử lý logic khi form được submit
        console.log('Tên Nhóm:', this.tenNhom);
        // Gán tự động số lượng, mã mời, nhóm trưởng
    }
}