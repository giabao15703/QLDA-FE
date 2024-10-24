import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';

@Component({
    standalone: true,
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    imports: [SidebarComponent, NavbarComponent],
})
export class NotificationComponent {
    constructor() {
        // Khởi tạo các biến hoặc dịch vụ cần thiết
    }

    ngOnInit() {
        // Thực hiện các hành động khi component được khởi tạo
    }
}
