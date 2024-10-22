import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
@Component({
    standalone: true,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'], // Nếu bạn có tệp CSS cho trang này
    imports: [
        SidebarComponent,
        NavbarComponent
    ]
    ,
})
export class DashboardComponent {
    constructor() {
        
        // Khởi tạo các biến hoặc dịch vụ cần thiết
    }

    ngOnInit() {
        // Thực hiện các hành động khi component được khởi tạo
    }
}