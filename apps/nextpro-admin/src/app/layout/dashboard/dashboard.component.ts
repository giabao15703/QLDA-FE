import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';

import { NavListComponent } from '#admin/layout/dashboard/nav-list/nav-list.component';
import { MaterialModules } from '#shared/modules';
import { AuthService, ConfirmService, LocalStorageService } from '#shared/services';
import { E_Role, I_NavItem, I_Profile } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-admin-layout-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        MaterialModules,
        NavListComponent,
        BreadcrumbComponent,
        BreadcrumbItemDirective,
    ],
})
export class LayoutDashboard {
    constructor(
        private confirmService: ConfirmService,
        private authService: AuthService,
        private translateService: TranslateService,
        private localStorageService: LocalStorageService,
    ) {}
    user: I_Profile = {};
    showSidebar = true;
    menuData: I_NavItem[] = [];

    ngOnInit() {
        this.user = this.localStorageService.get('user');
        const showSidebar = this.localStorageService.get('showSidebar') ?? true;
        this.showSidebar = showSidebar;

        const adminData = this.localStorageService.get('admin');
        let admin;

        // Kiểm tra nếu adminData là chuỗi JSON hoặc đối tượng
        if (typeof adminData === 'string') {
            admin = JSON.parse(adminData);
        } else {
            admin = adminData;
        }

        // Sử dụng hàm chuyển đổi để chuyển role từ chuỗi sang số
        const adminRole = convertRoleToNumber(admin.role);

        console.log('Role của admin:', adminRole);
        console.log('Role trưởng khoa:', E_Role.A_1);

        // Kiểm tra nếu role của admin là trưởng khoa
        const isTruongKhoa = adminRole === E_Role.A_1;
        const isGiaoVu = adminRole === E_Role.A_2;
        const isGiangVien = adminRole === E_Role.A_3;
        const isTruongBoMon = adminRole === E_Role.A_4;

        // Khởi tạo menuData với điều kiện hiển thị dựa trên role
        this.menuData = [
            {
                name: 'Home',
                icon: '/assets/icons/home-icon-silhouette.svg',
            },
            ...(isTruongKhoa
                ? [
                      {
                          name: 'Account',
                          icon: '/assets/icons/account.svg',
                          children: [
                              {
                                  name: 'Account',
                                  icon: '/assets/icons/buyer.svg',
                                  href: '/admin/account/',
                              },
                              {
                                  name: 'Admin Account',
                                  icon: '/assets/icons/admin.svg',
                                  href: '/admin/account/admin',
                              },
                          ],
                      },
                      {
                          name: 'Kế hoạch đồ án',
                          icon: '/assets/icons/setting-3-svgrepo-com.svg',
                          href: '/admin/keHoach',
                      },
                      {
                          name: 'Đề Tài',
                          icon: '/assets/icons/setting-3-svgrepo-com.svg',
                          href: '/admin/deTai',
                      },
                      {
                          name: 'Nhóm đồ án',
                          icon: '/assets/icons/setting-3-svgrepo-com.svg',
                          href: '/admin/group',
                      },
                      {
                            name:'Chấm điểm hướng dẫn',
                            icon:'/assets/icons/setting-3-svgrepo-com.svg',
                            href:'/admin/cham-huong-dan'
                      }
                  ]
                : []),
            ...(isGiangVien
                ? [
                      {
                          name: 'Đề Tài',
                          icon: '/assets/icons/setting-3-svgrepo-com.svg',
                          href: '/admin/deTai',
                      },
                      {
                          name: 'Nhóm đồ án',
                          icon: '/assets/icons/setting-3-svgrepo-com.svg',
                          href: '/admin/group',
                      },
                  ]
                : []),
            ...(isGiaoVu
                ? [
                      {
                          name: 'Account',
                          icon: '/assets/icons/account.svg',
                          children: [
                              {
                                  name: 'Account',
                                  icon: '/assets/icons/buyer.svg',
                                  href: '/admin/account/',
                              },
                              {
                                  name: 'Admin Account',
                                  icon: '/assets/icons/admin.svg',
                                  href: '/admin/account/admin',
                              },
                          ],
                      },
                      {
                          name: 'Nhóm đồ án',
                          icon: '/assets/icons/setting-3-svgrepo-com.svg',
                          href: '/admin/group',
                      },
                  ]
                : []),
            ...(isTruongBoMon
                ? [
                      {
                          name: 'Account',
                          icon: '/assets/icons/account.svg',
                          children: [
                              {
                                  name: 'Account',
                                  icon: '/assets/icons/buyer.svg',
                                  href: '/admin/account/',
                              },
                              {
                                  name: 'Admin Account',
                                  icon: '/assets/icons/admin.svg',
                                  href: '/admin/account/admin',
                              },
                          ],
                      },
                      {
                          name: 'Nhóm đồ án',
                          icon: '/assets/icons/setting-3-svgrepo-com.svg',
                          href: '/admin/group',
                      },
                  ]
                : []),
        ];
    }

    toggleSidebar = () => {
        this.localStorageService.set('showSidebar', !this.showSidebar);
        this.showSidebar = !this.showSidebar;
    };

    logOut = () => {
        this.confirmService.open(
            this.translateService.instant('auth.logout.confirmTitle'),
            this.translateService.instant('auth.logout.confirmContent'),
            () => {
                this.authService.logout('/auth/login');
            },
        );
    };
}
function convertRoleToNumber(role: string): number {
    switch (role) {
        case 'A_1':
            return E_Role.A_1;
        case 'A_2':
            return E_Role.A_2;
        case 'A_3':
            return E_Role.A_3;
        default:
            return 0; // Giá trị mặc định nếu role không hợp lệ
    }
}
