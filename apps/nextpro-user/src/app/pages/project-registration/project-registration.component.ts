import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
@Component({
    standalone: true,
    selector: 'app-project-registration',
    templateUrl: './project-registration.component.html',
    styleUrls: ['./project-registration.component.scss'], // Nếu bạn có tệp CSS cho trang này
    imports: [SidebarComponent, NavbarComponent],
})
export class ProjectRegistrationComponent {
    constructor() {
        // Khởi tạo các biến hoặc dịch vụ cần thiết
    }

    ngOnInit() {
        // Thực hiện các hành động khi component được khởi tạo
    }
}
