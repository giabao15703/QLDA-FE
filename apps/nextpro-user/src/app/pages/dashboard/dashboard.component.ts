import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
@Component({
    standalone: true,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'], // Nếu bạn có tệp CSS cho trang này
    imports: [SidebarComponent, NavbarComponent],
})
export class DashboardComponent {
    shortName: string = ''; // Biến để lưu shortName

    constructor() {}

    ngOnInit() {
        // Lấy dữ liệu user từ localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);

            // Gắn shortName từ user nếu tồn tại
            this.shortName = user?.shortName ?? 'Không có shortName';
        }
    }
}
