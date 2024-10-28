import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';

import { NavListComponent } from '#admin/layout/dashboard/nav-list/nav-list.component';
import { MaterialModules } from '#shared/modules';
import { AuthService, ConfirmService, LocalStorageService } from '#shared/services';
import { I_NavItem } from '#shared/types';

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

    showSidebar = true;

    menuData: I_NavItem[] = [
        {
            name: 'Home',
            icon: '/assets/icons/home-icon-silhouette.svg',
        },
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
        /* {
            name: 'Master Data',
            icon: '/assets/icons/database.svg',
            children: [
                {
                    name: 'Country',
                    icon: '/assets/icons/flag-2-svgrepo-com.svg',
                    href: '/admin/master-data/country',
                },
                {
                    name: 'City',
                    icon: '/assets/icons/city-svgrepo-com.svg',
                    href: '/admin/master-data/city',
                },
                {
                    name: 'Currency',
                    icon: '/assets/icons/currency-dollar-svgrepo-com.svg',
                    href: '/admin/master-data/currency',
                },
                {
                    name: 'Unit of Measure',
                    icon: '/assets/icons/measure-svgrepo-com.svg',
                    href: '/admin/master-data/unit-of-measure',
                },
                {
                    name: 'CCC',
                    icon: '/assets/icons/cash-svgrepo-com.svg',
                    href: '/admin/master-data/ccc',
                },
                {
                    name: 'Delivery Term',
                    icon: '/assets/icons/delivery-svgrepo-com.svg',
                    href: '/admin/master-data/delivery-term',
                },
                {
                    name: 'Payment Term',
                    icon: '/assets/icons/payment-card-svgrepo-com.svg',
                    href: '/admin/master-data/payment-term',
                },
                {
                    name: 'Reject Reason',
                    icon: '/assets/icons/reject-cross-delete-svgrepo-com.svg',
                    href: '/admin/master-data/reject-reason',
                },
                {
                    name: 'Industrial List',
                    icon: '/assets/icons/factory-industry-svgrepo-com.svg',
                    href: '/admin/master-data/industrial-list',
                },
                {
                    name: 'Gender',
                    icon: '/assets/icons/gender-mark-2-svgrepo-com.svg',
                    href: '/admin/master-data/gender',
                },
                {
                    name: 'Position',
                    icon: '/assets/icons/male-job-search-symbol-svgrepo-com.svg',
                    href: '/admin/master-data/position',
                },
                {
                    name: 'Language',
                    icon: '/assets/icons/language-svgrepo-com.svg',
                    href: '/admin/master-data/language',
                },
                {
                    name: 'Number of Employee',
                    icon: '/assets/icons/employee-id-svgrepo-com.svg',
                    href: '/admin/master-data/number-of-employee',
                },
                {
                    name: 'Promotion',
                    icon: '/assets/icons/price-tag-coupon-promotion-svgrepo-com.svg',
                    href: '/admin/master-data/promotion',
                },
                {
                    name: 'Email Template',
                    icon: '/assets/icons/email-svgrepo-com.svg',
                    href: '/admin/master-data/email-template',
                },
                {
                    name: 'Voucher',
                    icon: '/assets/icons/email-svgrepo-com.svg',
                    href: '/admin/master-data/voucher',
                },
                {
                    name: 'Warranty Term',
                    icon: '/assets/icons/setting-3-svgrepo-com.svg',
                    href: '/admin/master-data/warranty-term',
                },
                {
                    name: 'Buyer Club Voucher',
                    icon: '/assets/icons/setting-3-svgrepo-com.svg',
                    href: '/admin/master-data/buyer-club-voucher',
                },
                {
                    name: 'Set Product Advertisement',
                    icon: '/assets/icons/setting-3-svgrepo-com.svg',
                    href: '/admin/master-data/set-product-advertisement',
                },
            ],
        }, */
        /* {
            name: 'User Guide',
            icon: '/assets/icons/study-book-svgrepo-com.svg',
            children: [
                {
                    name: 'Buyer',
                    icon: '/assets/icons/buyer.svg',
                    href: '/admin/user-guide/buyer',
                },
                {
                    name: 'Supplier',
                    icon: '/assets/icons/supplier.svg',
                    href: '/admin/user-guide/supplier',
                },
            ],
        },
        {
            name: 'Sale Scheme',
            icon: '/assets/icons/sale-schema.svg',
            children: [
                {
                    name: 'Buyer',
                    icon: '/assets/icons/buyer.svg',
                    href: '/admin/sale-scheme/buyer',
                },
                {
                    name: 'Supplier',
                    icon: '/assets/icons/supplier.svg',
                    href: '/admin/sale-scheme/supplier',
                },
                {
                    name: 'Auction Fee',
                    icon: '/assets/icons/auction.svg',
                    href: '/admin/sale-scheme/auction-fee',
                },
                {
                    name: 'Flatrate',
                    icon: '/assets/icons/flatrate.svg',
                    href: '/admin/sale-scheme/flatrate',
                },
                {
                    name: 'Sponsor Fee',
                    icon: '/assets/icons/sponsor.svg',
                    href: '/admin/sale-scheme/sponsor-fee',
                },
            ],
        },
        {
            name: 'Flash Sale',
            icon: '/assets/icons/flash-sale.svg',
            href: '/admin/flash-sale',
        },
        {
            name: 'Product',
            icon: '/assets/icons/delivery-box.svg',
            href: '/admin/product',
        },
        {
            name: 'Diamond Sponsor',
            icon: '/assets/icons/company-svgrepo-com.svg',
            href: '/admin/diamond-sponsor',
        },
        {
            name: 'Banner',
            icon: '/assets/icons/layout-banner-svgrepo-com.svg',
            href: '/admin/banner',
        },
        {
            name: 'SICP',
            icon: '/assets/icons/file-svgrepo-com.svg',
            href: '/admin/sicp',
        },
        {
            name: 'Payment',
            icon: '/assets/icons/payment-svgrepo-com.svg',
            children: [
                {
                    name: 'Buyer',
                    icon: '/assets/icons/buyer.svg',
                    href: '/admin/payment/buyer',
                },
                {
                    name: 'Supplier',
                    icon: '/assets/icons/supplier.svg',
                    href: '/admin/payment/supplier',
                },
            ],
        },
        {
            name: 'Coupon',
            icon: '/assets/icons/coupon.svg',
            href: '/admin/coupon',
        }, */
        /* {
            name: 'Shipping Fee',
            icon: '/assets/icons/coupon.svg',
            href: '/admin/shipping-fee',
        }, */
        /* {
            name: 'Our Partners',
            icon: '/assets/icons/partner-svgrepo-com.svg',
            href: '/admin/our-partner',
        },
        {
            name: 'RFx',
            icon: '/assets/icons/setting-3-svgrepo-com.svg',
            href: '/admin/rfx',
        }, */
        {
            name: 'Group',
            icon: '/assets/icons/setting-3-svgrepo-com.svg',
            href: '/admin/group',
        },
        {
            name: 'Đề Tài',
            icon: '/assets/icons/setting-3-svgrepo-com.svg',
            href: '/admin/deTai',
        },
        /* {
            name: 'Delivery',
            icon: '/assets/icons/setting-3-svgrepo-com.svg',
            children: [
                {
                    name: 'Transporter List',
                    icon: '/assets/icons/buyer.svg',
                    href: '/admin/delivery/transporter-list',
                },
                {
                    name: 'Responsible',
                    icon: '/assets/icons/supplier.svg',
                    href: '/admin/delivery/delivery-responsible',
                },
                {
                    name: 'Shipping Fee',
                    icon: '/assets/icons/supplier.svg',
                    href: '/admin/delivery/shipping-fee',
                },
            ],
        }, */
        /* {
            name: 'Purchase Order List',
            icon: '/assets/icons/setting-3-svgrepo-com.svg',
            href: '/admin/purchase-order-list',
        },
        {
            name: 'Buyer Club ',
            icon: '/assets/icons/setting-3-svgrepo-com.svg',
            href: '/admin/buyer-club',
        },
        {
            name: 'Organization Management',
            icon: '/assets/icons/setting-3-svgrepo-com.svg',
            href: '/admin/organization-management',
        },
        {
            name: 'Banner Industry Focus',
            icon: '/assets/icons/setting-3-svgrepo-com.svg',
            href: '/admin/banner-industry-focus',
        }, */
    ];

    ngOnInit() {
        const showSidebar = this.localStorageService.get('showSidebar') ?? true;
        this.showSidebar = showSidebar;
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
